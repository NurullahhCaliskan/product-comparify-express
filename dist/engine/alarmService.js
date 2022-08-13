"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const websiteService_1 = __importDefault(require("../service/websiteService"));
const productHistoryService_1 = __importDefault(require("../service/productHistoryService"));
const storeService_1 = __importDefault(require("../service/storeService"));
class AlarmService {
    async setToUserCachedAlarm(usersWhichSendingAlarmList, userWebsiteRelationList, priceRate, yesterdayProduct, todayProduct) {
        let newUserWebsiteRelationList = [];
        //if priceRateCoupleEntity = 0 means nothing change
        if (priceRate > 0) {
            newUserWebsiteRelationList.push(...userWebsiteRelationList.filter(entity => priceRate > entity.value));
        }
        else if (priceRate < 0) {
            newUserWebsiteRelationList.push(...userWebsiteRelationList.filter(entity => -1 * priceRate > entity.value));
        }
        if (newUserWebsiteRelationList.length > 0) {
            await AlarmService.mergeUsersWithNewAlarm(usersWhichSendingAlarmList, newUserWebsiteRelationList, priceRate, yesterdayProduct, todayProduct);
        }
    }
    static async mergeUsersWithNewAlarm(storesWhichSendingAlarmList, userWebsiteRelationList, priceRate, yesterdayProduct, todayProduct) {
        var _a, _b, _c;
        let websiteService = new websiteService_1.default();
        let productHistoryService = new productHistoryService_1.default();
        let storeService = new storeService_1.default();
        for (const userWebsiteRelation of userWebsiteRelationList) {
            let website = userWebsiteRelation.website;
            let storeId = userWebsiteRelation.storeId;
            let storeIndex = storesWhichSendingAlarmList.findIndex(user => user.id === storeId);
            //get website currency
            let websiteService = new websiteService_1.default();
            let websiteEntity = await websiteService.getWebsiteByUrl(website);
            // @ts-ignore
            if (todayProduct.variants[0].id !== yesterdayProduct.variants[0].id) {
                continue;
            }
            let todayProductVariant = todayProduct.variants[0];
            let yesterdayProductVariant = yesterdayProduct.variants[0];
            //if user exists
            if (storeIndex > -1) {
                let productHistory = await productHistoryService.getProductHistoryByProductId(todayProduct.id);
                // @ts-ignore
                let newAlarmJson = { website: website, url: productHistory.url, newValue: todayProductVariant.price, oldValue: yesterdayProductVariant.price, priceChangeRate: priceRate, productTitle: todayProductVariant.parent_title + ' - ' + todayProductVariant.title, src: (_a = productHistory === null || productHistory === void 0 ? void 0 : productHistory.images[0]) === null || _a === void 0 ? void 0 : _a.src, currency: websiteEntity.cart.currency, newValueAsUsd: todayProductVariant.compare_at_price_usd, oldValueAsUsd: yesterdayProductVariant.compare_at_price_usd };
                (_b = storesWhichSendingAlarmList[storeIndex].cachedAlarm) === null || _b === void 0 ? void 0 : _b.push(newAlarmJson);
            }
            else {
                let productHistory = await productHistoryService.getProductHistoryByProductId(todayProduct.id);
                // @ts-ignore
                let newAlarmJson = { website: website, url: productHistory.url, newValue: todayProductVariant.price, oldValue: yesterdayProductVariant.price, priceChangeRate: priceRate, productTitle: todayProductVariant.parent_title + ' - ' + todayProductVariant.title, src: (_c = productHistory === null || productHistory === void 0 ? void 0 : productHistory.images[0]) === null || _c === void 0 ? void 0 : _c.src, currency: websiteEntity.cart.currency, newValueAsUsd: todayProductVariant.compare_at_price_usd, oldValueAsUsd: yesterdayProductVariant.compare_at_price_usd };
                let storeModel = await storeService.getStoreByStoreId(storeId);
                storesWhichSendingAlarmList.push({ id: storeId, cachedAlarm: [newAlarmJson], selectedMail: storeModel.selectedMail });
            }
        }
    }
}
exports.default = AlarmService;
