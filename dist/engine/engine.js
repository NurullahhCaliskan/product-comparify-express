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
const priceCollector_1 = __importDefault(require("./priceCollector"));
const engineConfig_1 = __importStar(require("./engineConfig"));
const alarmService_1 = __importDefault(require("./alarmService"));
const arrayUtility_1 = require("../utility/arrayUtility");
const mailService_1 = __importDefault(require("../mail/mailService"));
const cronUtility_1 = require("../utility/cronUtility");
const engineHistoryService_1 = __importDefault(require("../service/engineHistoryService"));
const engineHistoryModel_1 = __importDefault(require("../model/engineHistoryModel"));
class Engine {
    startEngine() {
        let engine = new Engine();
        const job = node_schedule_1.default.scheduleJob((0, cronUtility_1.EVERY_DAY_AT_MIDNIGHT)(), function () {
            return __awaiter(this, void 0, void 0, function* () {
                if (!engineConfig_1.runPermission) {
                    return;
                }
                (0, engineConfig_1.default)(false);
                console.log('start engine1');
                try {
                    let engineHistoryService = new engineHistoryService_1.default();
                    let engineHistoryModelStart = new engineHistoryModel_1.default(new Date(), "Start Run Engine");
                    yield engineHistoryService.saveEngineHistory(engineHistoryModelStart);
                    yield engine.collectAllProducts();
                    yield engine.prepareAlarmToSendMail();
                    let engineHistoryModelEnd = new engineHistoryModel_1.default(new Date(), "End Run Engine");
                    yield engineHistoryService.saveEngineHistory(engineHistoryModelEnd);
                }
                catch (e) {
                    console.log(e);
                }
                console.log('end engine2');
                (0, engineConfig_1.default)(true);
            });
        });
    }
    collectAllProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('start collectAllProducts');
            let userWebsitesRelationService = new userWebsitesRelationService_1.default();
            let websiteService = new websiteService_1.default();
            let productHistoryService = new productHistoryService_1.default();
            yield productHistoryService.removeTodayProducts();
            yield this.syncWebsites();
            //get websites for collect data
            let websites = yield websiteService.getWebsites();
            for (const website of websites) {
                let productHistoryService = new productHistoryService_1.default();
                yield productHistoryService.saveProductsFromWebByUrl(website);
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
            //get unique website list
            for (const website of websitesList) {
                let relevantUserByWebsite = userWebsitesRelationService.getUserFilterWebsiteAndAlarmStatus(UserWebsitesRelationList, website.url);
                let yesterdayProductList = yield productHistoryService.getProductHistoryByDaysAndWebsiteYesterday(website.url);
                let todayProductList = yield productHistoryService.getProductHistoryByDaysAndWebsiteToday(website.url);
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
            //load websites cart
            for (const website of uniqueWebsites) {
                let collectionResponse = yield websiteService.getCartByWebsiteNameFromWeb(website);
                yield websiteService.upsertWebSitesCart(website, collectionResponse);
            }
        });
    }
}
exports.default = Engine;
