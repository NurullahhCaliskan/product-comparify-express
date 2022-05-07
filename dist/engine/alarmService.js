"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AlarmService {
    setToUserCachedAlarm(usersWhichSendingAlarmList, userWebsiteRelationList, priceIdCouple, yesterdayProduct, todayProduct) {
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
                AlarmService.mergeUsersWithNewAlarm(usersWhichSendingAlarmList, newUserWebsiteRelationList, priceRateCoupleEntity, yesterdayProduct, todayProduct);
            }
        }
    }
    static mergeUsersWithNewAlarm(usersWhichSendingAlarmList, userWebsiteRelationList, priceIdCouple, yesterdayProduct, todayProduct) {
        var _a;
        for (const userWebsiteRelation of userWebsiteRelationList) {
            let website = userWebsiteRelation.website;
            let alarmValue = priceIdCouple.priceRate;
            let userId = userWebsiteRelation.userId;
            let userIndex = usersWhichSendingAlarmList.findIndex(user => user.userId === userId);
            //if user exists
            if (userIndex > 0) {
                // @ts-ignore
                let todayProductVariant = todayProduct.variants.find(variant => variant.id === priceIdCouple.productId);
                // @ts-ignore
                let yesterdayProductVariant = yesterdayProduct.variants.find(variant => variant.id === priceIdCouple.productId);
                // @ts-ignore
                let newAlarmJson = { website: website, url: yesterdayProduct.url, newValue: todayProductVariant.price, oldValue: yesterdayProductVariant.price, priceChangeRate: priceIdCouple.priceRate, productTitle: todayProductVariant.title };
                (_a = usersWhichSendingAlarmList[userIndex].cachedAlarm) === null || _a === void 0 ? void 0 : _a.push(newAlarmJson);
            }
            else {
                // @ts-ignore
                let todayProductVariant = todayProduct.variants.find(variant => variant.id === priceIdCouple.productId);
                // @ts-ignore
                let yesterdayProductVariant = yesterdayProduct.variants.find(variant => variant.id === priceIdCouple.productId);
                // @ts-ignore
                let newAlarmJson = { website: website, url: yesterdayProduct.url, newValue: todayProductVariant.price, oldValue: yesterdayProductVariant.price, priceChangeRate: priceIdCouple.priceRate, productTitle: todayProductVariant.title };
                usersWhichSendingAlarmList.push({ userId: userId, cachedAlarm: [newAlarmJson] });
            }
        }
    }
}
exports.default = AlarmService;
