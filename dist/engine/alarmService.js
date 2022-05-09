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
const userService_1 = __importDefault(require("../service/userService"));
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
    static mergeUsersWithNewAlarm(usersWhichSendingAlarmList, userWebsiteRelationList, priceIdCouple, yesterdayProduct, todayProduct) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            for (const userWebsiteRelation of userWebsiteRelationList) {
                let userService = new userService_1.default();
                let website = userWebsiteRelation.website;
                let alarmValue = priceIdCouple.priceRate;
                let userId = userWebsiteRelation.userId;
                let userIndex = usersWhichSendingAlarmList.findIndex(user => user.userId === userId);
                console.log("userIndex = " + userIndex + "  UserId = " + userId);
                //if user exists
                if (userIndex > -1) {
                    // @ts-ignore
                    let todayProductVariant = todayProduct.variants.find(variant => variant.id === priceIdCouple.productId);
                    // @ts-ignore
                    let yesterdayProductVariant = yesterdayProduct.variants.find(variant => variant.id === priceIdCouple.productId);
                    // @ts-ignore
                    let newAlarmJson = { website: website, url: yesterdayProduct.url, newValue: todayProductVariant.price, oldValue: yesterdayProductVariant.price, priceChangeRate: priceIdCouple.priceRate, productTitle: todayProductVariant.title, src: (_a = todayProduct === null || todayProduct === void 0 ? void 0 : todayProduct.images[0]) === null || _a === void 0 ? void 0 : _a.src };
                    (_b = usersWhichSendingAlarmList[userIndex].cachedAlarm) === null || _b === void 0 ? void 0 : _b.push(newAlarmJson);
                }
                else {
                    // @ts-ignore
                    let todayProductVariant = todayProduct.variants.find(variant => variant.id === priceIdCouple.productId);
                    // @ts-ignore
                    let yesterdayProductVariant = yesterdayProduct.variants.find(variant => variant.id === priceIdCouple.productId);
                    // @ts-ignore
                    let newAlarmJson = { website: website, url: yesterdayProduct.url, newValue: todayProductVariant.price, oldValue: yesterdayProductVariant.price, priceChangeRate: priceIdCouple.priceRate, productTitle: todayProductVariant.title, src: (_c = todayProduct === null || todayProduct === void 0 ? void 0 : todayProduct.images[0]) === null || _c === void 0 ? void 0 : _c.src };
                    let user = yield userService.getUserByUserId(userId);
                    usersWhichSendingAlarmList.push({ userId: userId, cachedAlarm: [newAlarmJson], mail: user.mail });
                }
            }
        });
    }
}
exports.default = AlarmService;
