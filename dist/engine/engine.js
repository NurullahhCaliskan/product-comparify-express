"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
class Engine {
    startEngine() {
        let enginePermissionService = new enginePermissionService_1.default();
        let engine = new Engine();
        let engineHistoryService = new engineHistoryService_1.default();
        // @ts-ignore
        const job = node_schedule_1.default.scheduleJob((0, cronUtility_1.GET_MAIN_SCHEDULED_AS_SECOND)(), function () {
            return __awaiter(this, void 0, void 0, function* () {
                console.log('start engine');
                //if no available, exit
                if (!(yield enginePermissionService.isAvailableRunMainEngine())) {
                    console.log('engine is not avaible');
                    return;
                }
                let startDate = new Date();
                //set unavailable
                yield enginePermissionService.setUnavailableMainEngine();
                console.log('start engine1');
                try {
                    yield engine.collectAllProducts();
                    yield engine.prepareAlarmToSendMail();
                }
                catch (e) {
                    console.log(e);
                }
                console.log('end engine');
                //set available
                yield enginePermissionService.setAvailableMainEngine();
                let engineHistoryModelEnd = new engineHistoryModel_1.default(startDate, new Date());
                yield engineHistoryService.saveEngineHistory(engineHistoryModelEnd);
            });
        });
    }
    collectAllProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('start collectAllProducts');
            let userWebsitesRelationService = new storeWebsitesRelationService_1.default();
            let websiteService = new websiteService_1.default();
            let productHistoryService = new productHistoryService_1.default();
            let currencyService = new currencyService_1.default();
            if (process.env.PERMISSION_CONVERT_CURRENCY === 'true') {
                yield currencyService.saveCurrenciesByApi();
            }
            yield currencyService.refreshCurrencyList();
            yield this.syncWebsites();
            //get websites for collect data
            let websites = yield websiteService.getWebsites();
            for (const website of websites) {
                yield productHistoryService.saveProductsFromWebByUrl(website);
            }
        });
    }
    prepareAlarmToSendMail() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('prepareAlarmToSendMail');
            let storeWebsitesRelationService = new storeWebsitesRelationService_1.default();
            let productHistoryService = new productHistoryService_1.default();
            let productPriceHistoryService = new productPriceHistoryService_1.default();
            let websiteService = new websiteService_1.default();
            let alarmService = new alarmService_1.default();
            let productMailHistoryService = new productMailHistoryService_1.default();
            let storesWhichSendingAlarmList = [];
            let storeWebsitesRelationList = yield storeWebsitesRelationService.getUserWebsitesRelations();
            let websitesList = yield websiteService.getWebsites();
            //get unique website list
            for (const website of websitesList) {
                let relevantUserByWebsite = storeWebsitesRelationService.getStoreFilterWebsiteAndAlarmStatus(storeWebsitesRelationList, website.url);
                let yesterdayProductList = yield productPriceHistoryService.getProductHistoryByDaysAndWebsiteYesterday(website.url);
                let todayProductList = yield productPriceHistoryService.getProductHistoryByDaysAndWebsiteToday(website.url);
                //if today or yesterday product lis is empty, go back.
                if ((0, arrayUtility_1.arrayIsEmpty)(yesterdayProductList) || (0, arrayUtility_1.arrayIsEmpty)(todayProductList)) {
                    continue;
                }
                console.log(yesterdayProductList[0]);
                console.log(todayProductList[0]);
                for (const index in yesterdayProductList) {
                    let priceCollector = new priceCollector_1.default();
                    let id = yesterdayProductList[index].id;
                    let yesterdayEqualProductList = yesterdayProductList.filter(product => product.id === id);
                    console.log(yesterdayEqualProductList);
                    //if not exists, this product not exist yesterday on db
                    if (!yesterdayEqualProductList || yesterdayEqualProductList.length === 0) {
                        continue;
                    }
                    console.log("giridi");
                    let priceIdCouple = priceCollector.getPriceChangeVariantListByProduct(todayProductList[index], yesterdayEqualProductList[0]);
                    console.log(priceIdCouple);
                    console.log(yesterdayEqualProductList);
                    //find users which cache product alarm
                    yield alarmService.setToUserCachedAlarm(storesWhichSendingAlarmList, relevantUserByWebsite, priceIdCouple, yesterdayEqualProductList[0], todayProductList[index]);
                }
            }
            console.log(JSON.stringify(storesWhichSendingAlarmList));
            console.log('send mail to users');
            console.log(storesWhichSendingAlarmList.length);
            for (const storeModel of storesWhichSendingAlarmList) {
                let mailService = new mailService_1.default();
                yield mailService.sendMail(storeModel);
                // @ts-ignore
                for (const cachedAlarm of storeModel.cachedAlarm) {
                    let productMailHistoryModel = new productMailHistoryModel_1.default(storeModel.id, cachedAlarm.website, cachedAlarm.url, cachedAlarm.newValue, cachedAlarm.oldValue, cachedAlarm.priceChangeRate, cachedAlarm.productTitle, cachedAlarm.src, cachedAlarm.currency, new Date, storeModel.selectedMail, cachedAlarm.newValueAsUsd, cachedAlarm.oldValueAsUsd);
                    yield productMailHistoryService.saveProductMailHistory(productMailHistoryModel);
                }
            }
        });
    }
    syncWebsites() {
        return __awaiter(this, void 0, void 0, function* () {
            let userWebsitesRelationService = new storeWebsitesRelationService_1.default();
            let UserWebsitesRelationList = yield userWebsitesRelationService.getUserWebsitesRelations();
            //console.log(UserWebsitesRelationList)
            //get unique website list
            const uniqueWebsites = [...new Set(UserWebsitesRelationList.map(item => item.website))];
            //upsert collections
            let websiteService = new websiteService_1.default();
            for (const website of uniqueWebsites) {
                let collectionResponse = yield websiteService.getCollectionByWebsiteNameFromWeb(website);
                if (collectionResponse.length > 0) {
                    yield websiteService.upsertWebSitesAllCollections(website, collectionResponse);
                }
            }
            //load websites favicon
            for (const website of uniqueWebsites) {
                let collectionResponse = yield websiteService.getFaviconUrlByWebsiteNameFromWeb(website);
                yield websiteService.upsertWebSitesFavicon(website, collectionResponse);
            }
            //load websites cart
            for (const website of uniqueWebsites) {
                let collectionResponse = yield websiteService.getCartByWebsiteNameFromWeb(website);
                yield websiteService.upsertWebSitesCart(website, collectionResponse);
            }
        });
    }
}
exports.default = Engine;
