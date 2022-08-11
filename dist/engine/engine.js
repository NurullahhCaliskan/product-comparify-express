"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const storeWebsitesRelationService_1 = __importDefault(require("../service/storeWebsitesRelationService"));
const websiteService_1 = __importDefault(require("../service/websiteService"));
const productHistoryService_1 = __importDefault(require("../service/productHistoryService"));
const priceCollector_1 = __importDefault(require("./priceCollector"));
const alarmService_1 = __importDefault(require("./alarmService"));
const arrayUtility_1 = require("../utility/arrayUtility");
const mailService_1 = __importDefault(require("../mail/mailService"));
const engineHistoryService_1 = __importDefault(require("../service/engineHistoryService"));
const engineHistoryModel_1 = __importDefault(require("../model/engineHistoryModel"));
const productPriceHistoryService_1 = __importDefault(require("../service/productPriceHistoryService"));
const enginePermissionService_1 = __importDefault(require("../service/enginePermissionService"));
const productMailHistoryService_1 = __importDefault(require("../service/productMailHistoryService"));
const productMailHistoryModel_1 = __importDefault(require("../model/productMailHistoryModel"));
const currencyService_1 = __importDefault(require("../service/currencyService"));
const propertiesService_1 = __importDefault(require("../service/propertiesService"));
const logUtility_1 = require("../utility/logUtility");
const threads_1 = require("threads");
class Engine {
    async runEngine() {
        let enginePermissionService = new enginePermissionService_1.default();
        let engine = new Engine();
        let engineHistoryService = new engineHistoryService_1.default();
        console.log('start engine');
        //if no available, exit
        if (!(await enginePermissionService.isAvailableRunMainEngine())) {
            console.log('engine is not avaible');
            return;
        }
        //set unavailable
        await enginePermissionService.setUnavailableMainEngine();
        console.log('start engine1');
        try {
            await engine.collectAllProducts();
        }
        catch (e) {
            console.log(e);
        }
        console.log('end engine');
        //set available
        await enginePermissionService.setAvailableMainEngine();
    }
    async collectAllProducts() {
        logUtility_1.logger.info(__filename + 'start collectAllProducts');
        let websiteService = new websiteService_1.default();
        let engineHistoryService = new engineHistoryService_1.default();
        let currencyService = new currencyService_1.default();
        let propertiesService = new propertiesService_1.default();
        if (process.env.PERMISSION_CONVERT_CURRENCY === 'true') {
            logUtility_1.logger.info(__filename + 'start save currencies by api');
            await currencyService.saveCurrenciesByApi();
        }
        let chunkedProperties = await propertiesService.getPropertiesByText('scrap-chunk-count');
        await engineHistoryService.saveEngineHistory(new engineHistoryModel_1.default(new Date(), new Date(), new Date(), 1, chunkedProperties.value));
        await currencyService.refreshCurrencyList();
        await this.syncWebsites();
        //get websites for collect data
        let websites = await websiteService.getWebsites();
        await this.runners(websites);
    }
    async runners(websites) {
        let propertiesService = new propertiesService_1.default();
        let engineHistoryService = new engineHistoryService_1.default();
        const pool = (0, threads_1.Pool)(() => (0, threads_1.spawn)(new threads_1.Worker('engineThreadWorker')));
        const myTasks = [];
        let chunkedProperties = await propertiesService.getPropertiesByText('scrap-chunk-count');
        let chunkedWebsites = (0, arrayUtility_1.divideChunks)(websites, chunkedProperties.value);
        try {
            for (let input = 0; input < chunkedProperties.value; input++) {
                myTasks.push(pool.queue(worker => worker(chunkedWebsites[input])));
            }
        }
        catch (e) {
            logUtility_1.logger.info(__filename + e);
        }
        await Promise.all(myTasks);
        await pool.terminate(true);
        logUtility_1.logger.info(__filename + ' complete collect');
        //finish engines
        await engineHistoryService.saveEngineHistory(new engineHistoryModel_1.default(new Date(), new Date(), new Date(), 2, 0));
        try {
            await this.prepareAlarmToSendMail();
            await engineHistoryService.saveEngineHistory(new engineHistoryModel_1.default(new Date(), new Date(), new Date(), 0, 0));
            logUtility_1.logger.info(__filename + ' complete engine');
        }
        catch (e) {
            logUtility_1.logger.error(__filename + 'catch3' + e);
            let date = new Date();
            date.setFullYear(2000);
            await engineHistoryService.saveEngineHistory(new engineHistoryModel_1.default(new Date(), new Date(), date, 0, 0));
        }
    }
    async prepareAlarmToSendMail() {
        console.log('prepareAlarmToSendMail');
        let storeWebsitesRelationService = new storeWebsitesRelationService_1.default();
        let productHistoryService = new productHistoryService_1.default();
        let productPriceHistoryService = new productPriceHistoryService_1.default();
        let websiteService = new websiteService_1.default();
        let alarmService = new alarmService_1.default();
        let productMailHistoryService = new productMailHistoryService_1.default();
        let storesWhichSendingAlarmList = [];
        let storeWebsitesRelationList = await storeWebsitesRelationService.getUserWebsitesRelations();
        let websitesList = await websiteService.getWebsites();
        //get unique website list
        for (const website of websitesList) {
            let relevantUserByWebsite = storeWebsitesRelationService.getStoreFilterWebsiteAndAlarmStatus(storeWebsitesRelationList, website.url);
            if (relevantUserByWebsite.length === 0) {
                continue;
            }
            let productsWithCompareList = await productPriceHistoryService.getProductHistoryWithCompare(website.url);
            //if today or yesterday product lis is empty, go back.
            if ((0, arrayUtility_1.arrayIsEmpty)(productsWithCompareList)) {
                continue;
            }
            for (const index in productsWithCompareList) {
                let priceCollector = new priceCollector_1.default();
                let id = productsWithCompareList[index].today_id;
                // @ts-ignore
                let priceIdCouple = priceCollector.getPriceChangeVariantListByProduct(productsWithCompareList[index].today_variant.price, productsWithCompareList[index].yesterday_variant.price);
                let [today, yesterday] = (0, arrayUtility_1.convertCompareToDayProductPrices)(productsWithCompareList[index]);
                await alarmService.setToUserCachedAlarm(storesWhichSendingAlarmList, relevantUserByWebsite, priceIdCouple, yesterday, today);
            }
        }
        console.log(JSON.stringify(storesWhichSendingAlarmList));
        console.log('send mail to users');
        console.log(storesWhichSendingAlarmList.length);
        for (const storeModel of storesWhichSendingAlarmList) {
            let mailService = new mailService_1.default();
            await mailService.sendMail(storeModel);
            // @ts-ignore
            for (const cachedAlarm of storeModel.cachedAlarm) {
                let productMailHistoryModel = new productMailHistoryModel_1.default(storeModel.id, cachedAlarm.website, cachedAlarm.url, cachedAlarm.newValue, cachedAlarm.oldValue, cachedAlarm.priceChangeRate, cachedAlarm.productTitle, cachedAlarm.src, cachedAlarm.currency, new Date, storeModel.selectedMail, cachedAlarm.newValueAsUsd, cachedAlarm.oldValueAsUsd);
                await productMailHistoryService.saveProductMailHistory(productMailHistoryModel);
            }
        }
    }
    async syncWebsites() {
        let userWebsitesRelationService = new storeWebsitesRelationService_1.default();
        let UserWebsitesRelationList = await userWebsitesRelationService.getUserWebsitesRelations();
        //console.log(UserWebsitesRelationList)
        //get unique website list
        const uniqueWebsites = [...new Set(UserWebsitesRelationList.map(item => item.website))];
        //upsert collections
        let websiteService = new websiteService_1.default();
        for (const website of uniqueWebsites) {
            let collectionResponse = await websiteService.getCollectionByWebsiteNameFromWeb(website);
            if (collectionResponse.length > 0) {
                await websiteService.upsertWebSitesAllCollections(website, collectionResponse);
            }
        }
        //load websites favicon
        for (const website of uniqueWebsites) {
            let collectionResponse = await websiteService.getFaviconUrlByWebsiteNameFromWeb(website);
            await websiteService.upsertWebSitesFavicon(website, collectionResponse);
        }
        //load websites cart
        for (const website of uniqueWebsites) {
            let collectionResponse = await websiteService.getCartByWebsiteNameFromWeb(website);
            await websiteService.upsertWebSitesCart(website, collectionResponse);
        }
    }
}
exports.default = Engine;
