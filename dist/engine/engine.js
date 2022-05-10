"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const userWebsitesRelationService_1 = __importDefault(require("../service/userWebsitesRelationService"));
const websiteService_1 = __importDefault(require("../service/websiteService"));
const productHistoryService_1 = __importDefault(require("../service/productHistoryService"));
const dayUtility_1 = require("../utility/dayUtility");
const priceCollector_1 = __importDefault(require("./priceCollector"));
const engineConfig_1 = __importStar(require("./engineConfig"));
const alarmService_1 = __importDefault(require("./alarmService"));
const arrayUtility_1 = require("../utility/arrayUtility");
const mailService_1 = __importDefault(require("../mail/mailService"));
class Engine {
    startEngine() {
        let engine = new Engine();
        const job = node_schedule_1.default.scheduleJob('0 0 * * *', function () {
            return __awaiter(this, void 0, void 0, function* () {
                if (!engineConfig_1.runPermission) {
                    return;
                }
                (0, engineConfig_1.default)(false);
                console.log('start engine1');
                try {
                    yield engine.collectAllProducts();
                    yield engine.prepareAlarmToSendMail();
                }
                catch (e) {
                    console.log(e);
                }
                console.log('end engine1');
                (0, engineConfig_1.default)(true);
            });
        });
    }
    collectAllProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('start collectAllProducts');
            let userWebsitesRelationService = new userWebsitesRelationService_1.default();
            let websiteService = new websiteService_1.default();
            yield this.syncWebsites();
            //get websites for collect data
            let websites = yield websiteService.getWebsites();
            console.log(websites);
            for (const website of websites) {
                let productHistoryService = new productHistoryService_1.default();
                yield productHistoryService.saveProductsFromWebByUrl(website.url, website.collection);
            }
        });
    }
    prepareAlarmToSendMail() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("prepareAlarmToSendMail");
            let userWebsitesRelationService = new userWebsitesRelationService_1.default();
            let productHistoryService = new productHistoryService_1.default();
            let websiteService = new websiteService_1.default();
            let alarmService = new alarmService_1.default();
            let usersWhichSendingAlarmList = [];
            let UserWebsitesRelationList = yield userWebsitesRelationService.getUserWebsitesRelations();
            let websitesList = yield websiteService.getWebsites();
            let yesterdayMidnight = (0, dayUtility_1.getYesterdayMidnight)();
            let todayMidnight = (0, dayUtility_1.getTodayMidnight)();
            //get unique website list
            for (const website of websitesList) {
                let relevantUserByWebsite = userWebsitesRelationService.getUserFilterWebsiteAndAlarmStatus(UserWebsitesRelationList, website.url);
                //start loop
                let productList = yield productHistoryService.getProductHistoryByDaysAndWebsite(website.url);
                //console.log( productList.filter(product => product.id === 6774978412614).length)
                //productList = productList.filter(product => product.id === 6774978412614);
                let yesterdayProductList = productList.filter(product => product.created_date_time > yesterdayMidnight && product.created_date_time < todayMidnight);
                let todayProductList = productList.filter(product => product.created_date_time > todayMidnight);
                //if today or yesterday product lis is empty, go back.
                if ((0, arrayUtility_1.arrayIsEmpty)(yesterdayProductList) || (0, arrayUtility_1.arrayIsEmpty)(todayProductList)) {
                    continue;
                }
                for (const index in yesterdayProductList) {
                    let priceCollector = new priceCollector_1.default();
                    let priceIdCouple = priceCollector.getPriceChangeVariantListByProduct(todayProductList[index], yesterdayProductList[index]);
                    //find users which cache product alarm
                    yield alarmService.setToUserCachedAlarm(usersWhichSendingAlarmList, relevantUserByWebsite, priceIdCouple, yesterdayProductList[index], todayProductList[index]);
                }
            }
            console.log(JSON.stringify(usersWhichSendingAlarmList));
            console.log('sorunsuz bir sekilde bitti, hayirli olsun');
            console.log("send mail to users");
            console.log(usersWhichSendingAlarmList.length);
            for (const userModel of usersWhichSendingAlarmList) {
                let mailService = new mailService_1.default();
                yield mailService.sendMail(userModel);
            }
        });
    }
    syncWebsites() {
        return __awaiter(this, void 0, void 0, function* () {
            let userWebsitesRelationService = new userWebsitesRelationService_1.default();
            let UserWebsitesRelationList = yield userWebsitesRelationService.getUserWebsitesRelations();
            //console.log(UserWebsitesRelationList)
            //get unique website list
            const uniqueWebsites = [...new Set(UserWebsitesRelationList.map(item => item.website))];
            //upsert collections
            let websiteService = new websiteService_1.default();
            console.log(uniqueWebsites);
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
        });
    }
}
exports.default = Engine;
