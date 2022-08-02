"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_schedule_1 = __importDefault(require("node-schedule"));
const storeWebsitesRelationService_1 = __importDefault(require("../service/storeWebsitesRelationService"));
const websiteService_1 = __importDefault(require("../service/websiteService"));
const productHistoryService_1 = __importDefault(require("../service/productHistoryService"));
const priceCollector_1 = __importDefault(require("./priceCollector"));
const alarmService_1 = __importDefault(require("./alarmService"));
const arrayUtility_1 = require("../utility/arrayUtility");
const mailService_1 = __importDefault(require("../mail/mailService"));
const cronUtility_1 = require("../utility/cronUtility");
const engineHistoryService_1 = __importDefault(require("../service/engineHistoryService"));
const engineHistoryModel_1 = __importDefault(require("../model/engineHistoryModel"));
const productPriceHistoryService_1 = __importDefault(require("../service/productPriceHistoryService"));
const enginePermissionService_1 = __importDefault(require("../service/enginePermissionService"));
const productMailHistoryService_1 = __importDefault(require("../service/productMailHistoryService"));
const productMailHistoryModel_1 = __importDefault(require("../model/productMailHistoryModel"));
const currencyService_1 = __importDefault(require("../service/currencyService"));
const propertiesService_1 = __importDefault(require("../service/propertiesService"));
const piscina_1 = __importDefault(require("piscina"));
const path_1 = __importDefault(require("path"));
class Engine {
    startEngine() {
        let enginePermissionService = new enginePermissionService_1.default();
        let engine = new Engine();
        let engineHistoryService = new engineHistoryService_1.default();
        // @ts-ignore
        const job = node_schedule_1.default.scheduleJob((0, cronUtility_1.GET_MAIN_SCHEDULED_AS_SECOND)(), async function () {
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
        });
    }
    async collectAllProducts() {
        console.log('start collectAllProducts');
        let websiteService = new websiteService_1.default();
        let engineHistoryService = new engineHistoryService_1.default();
        let currencyService = new currencyService_1.default();
        let propertiesService = new propertiesService_1.default();
        if (process.env.PERMISSION_CONVERT_CURRENCY === 'true') {
            await currencyService.saveCurrenciesByApi();
        }
        let chunkedProperties = await propertiesService.getPropertiesByText('scrap-chunk-count');
        await engineHistoryService.saveEngineHistory(new engineHistoryModel_1.default(new Date(), new Date(), 1, chunkedProperties.value));
        //await currencyService.refreshCurrencyList();
        await this.syncWebsites();
        //get websites for collect data
        let websites = await websiteService.getWebsites();
        await this.runners(websites);
    }
    async runners(websites) {
        let propertiesService = new propertiesService_1.default();
        let engineHistoryService = new engineHistoryService_1.default();
        const pool = new piscina_1.default();
        const options = { filename: path_1.default.resolve(__dirname, 'engineThreadWorker') };
        console.log(options);
        let chunkedProperties = await propertiesService.getPropertiesByText('scrap-chunk-count');
        let chunkedWebsites = (0, arrayUtility_1.divideChunks)(websites, chunkedProperties.value);
        let i = 0;
        let chunkedTread = [];
        for (i = 0; i < chunkedProperties.value; i++) {
            chunkedTread.push(pool.run(chunkedWebsites[i], options));
        }
        await Promise.all(chunkedTread);
        console.log('complete engine');
        //finish engines
        await engineHistoryService.saveEngineHistory(new engineHistoryModel_1.default(new Date(), new Date(), 2, 0));
        await this.prepareAlarmToSendMail();
        await engineHistoryService.saveEngineHistory(new engineHistoryModel_1.default(new Date(), new Date(), 0, 0));
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
            let yesterdayProductList = await productPriceHistoryService.getProductHistoryByDaysAndWebsiteYesterday(website.url);
            let todayProductList = await productPriceHistoryService.getProductHistoryByDaysAndWebsiteToday(website.url);
            //if today or yesterday product lis is empty, go back.
            if ((0, arrayUtility_1.arrayIsEmpty)(yesterdayProductList) || (0, arrayUtility_1.arrayIsEmpty)(todayProductList)) {
                continue;
            }
            for (const index in yesterdayProductList) {
                let priceCollector = new priceCollector_1.default();
                let id = yesterdayProductList[index].id;
                let todayEqualProductList = todayProductList.filter(product => product.id === id);
                //if not exists, this product not exist yesterday on db
                if (!todayEqualProductList || todayEqualProductList.length === 0) {
                    continue;
                }
                let priceIdCouple = priceCollector.getPriceChangeVariantListByProduct(todayEqualProductList[0], yesterdayProductList[index]);
                //find users which cache product alarm
                await alarmService.setToUserCachedAlarm(storesWhichSendingAlarmList, relevantUserByWebsite, priceIdCouple, yesterdayProductList[index], todayEqualProductList[0]);
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
