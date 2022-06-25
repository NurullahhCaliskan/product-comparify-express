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
const websiteService_1 = __importDefault(require("../service/websiteService"));
const productHistoryService_1 = __importDefault(require("../service/productHistoryService"));
const storeService_1 = __importDefault(require("../service/storeService"));
class AlarmService {
    setToUserCachedAlarm(usersWhichSendingAlarmList, userWebsiteRelationList, priceIdCouple, yesterdayProduct, todayProduct) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const priceRateCoupleEntity of priceIdCouple) {
                let newUserWebsiteRelationList = [];
                //if priceRateCoupleEntity = 0 means nothing change
                if (priceRateCoupleEntity.priceRate > 0) {
                    newUserWebsiteRelationList.push(...userWebsiteRelationList.filter(entity => priceRateCoupleEntity.priceRate > entity.value));
                }
                if (priceRateCoupleEntity.priceRate < 0) {
                    newUserWebsiteRelationList.push(...userWebsiteRelationList.filter(entity => priceRateCoupleEntity.priceRate < entity.value));
                }
                if (newUserWebsiteRelationList.length > 0) {
                    yield AlarmService.mergeUsersWithNewAlarm(usersWhichSendingAlarmList, newUserWebsiteRelationList, priceRateCoupleEntity, yesterdayProduct, todayProduct);
                }
            }
        });
    }
    static mergeUsersWithNewAlarm(storessWhichSendingAlarmList, userWebsiteRelationList, priceIdCouple, yesterdayProduct, todayProduct) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let websiteService = new websiteService_1.default();
            let productHistoryService = new productHistoryService_1.default();
            let storeService = new storeService_1.default();
            for (const userWebsiteRelation of userWebsiteRelationList) {
                let website = userWebsiteRelation.website;
                let alarmValue = priceIdCouple.priceRate;
                let storeId = userWebsiteRelation.storeId;
                let storeIndex = storessWhichSendingAlarmList.findIndex(user => user.id === storeId);
                //get website currency
                let websiteService = new websiteService_1.default();
                let websiteEntity = yield websiteService.getWebsiteByUrl(website);
                console.log("storeIndex = " + storeIndex + "  UserId = " + storeId);
                //if user exists
                if (storeIndex > -1) {
                    // @ts-ignore
                    let todayProductVariant = todayProduct.variants.find(variant => variant.id === priceIdCouple.productId);
                    // @ts-ignore
                    let yesterdayProductVariant = yesterdayProduct.variants.find(variant => variant.id === priceIdCouple.productId);
                    let productHistory = yield productHistoryService.getProductHistoryByProductId(todayProduct.id);
                    // @ts-ignore
                    let newAlarmJson = { website: website, url: productHistory.url, newValue: todayProductVariant.price, oldValue: yesterdayProductVariant.price, priceChangeRate: priceIdCouple.priceRate, productTitle: todayProductVariant.title, src: (_a = productHistory === null || productHistory === void 0 ? void 0 : productHistory.images[0]) === null || _a === void 0 ? void 0 : _a.src, currency: websiteEntity.cart.currency };
                    (_b = storessWhichSendingAlarmList[storeIndex].cachedAlarm) === null || _b === void 0 ? void 0 : _b.push(newAlarmJson);
                }
                else {
                    // @ts-ignore
                    let todayProductVariant = todayProduct.variants.find(variant => variant.id === priceIdCouple.productId);
                    // @ts-ignore
                    let yesterdayProductVariant = yesterdayProduct.variants.find(variant => variant.id === priceIdCouple.productId);
                    let productHistory = yield productHistoryService.getProductHistoryByProductId(todayProduct.id);
                    console.log(productHistory);
                    // @ts-ignore
                    let newAlarmJson = { website: website, url: productHistory.url, newValue: todayProductVariant.price, oldValue: yesterdayProductVariant.price, priceChangeRate: priceIdCouple.priceRate, productTitle: todayProductVariant.title, src: (_c = productHistory === null || productHistory === void 0 ? void 0 : productHistory.images[0]) === null || _c === void 0 ? void 0 : _c.src, currency: websiteEntity.cart.currency };
                    let storeModel = yield storeService.getStoreByStoreId(storeId);
                    storessWhichSendingAlarmList.push({ id: storeId, cachedAlarm: [newAlarmJson], selectedMail: storeModel.selectedMail });
                }
            }
        });
    }
}
exports.default = AlarmService;
