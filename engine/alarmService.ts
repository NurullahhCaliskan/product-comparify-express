import UserWebsitesRelationModel from "../model/userWebsitesRelationModel";
import UserModel from "../model/userModel";
import ProductHistoryModel from "../model/productHistoryModel";
import UserService from "../service/userService";
import WebsiteService from "../service/websiteService";
import ProductPriceHistoryModel from "../model/productPriceHistoryModel";
import ProductHistoryService from "../service/productHistoryService";

export default class AlarmService {

    async setToUserCachedAlarm(usersWhichSendingAlarmList: UserModel[], userWebsiteRelationList: UserWebsitesRelationModel[],
                               priceIdCouple: [{ productId: number, priceRate: number }], yesterdayProduct: ProductPriceHistoryModel,
                               todayProduct: ProductPriceHistoryModel) {

        for (const priceRateCoupleEntity of priceIdCouple) {

            let newUserWebsiteRelationList = [] as UserWebsitesRelationModel[]
            //if priceRateCoupleEntity = 0 means nothing change
            if (priceRateCoupleEntity.priceRate > 0) {
                newUserWebsiteRelationList.push(...userWebsiteRelationList.filter(entity => priceRateCoupleEntity.priceRate > entity.value));

            }
            if (priceRateCoupleEntity.priceRate < 0) {
                newUserWebsiteRelationList.push(...userWebsiteRelationList.filter(entity => priceRateCoupleEntity.priceRate < entity.value));
            }

            if (newUserWebsiteRelationList.length > 0) {
                await AlarmService.mergeUsersWithNewAlarm(usersWhichSendingAlarmList, newUserWebsiteRelationList, priceRateCoupleEntity, yesterdayProduct, todayProduct)
            }

        }
    }


    private static async mergeUsersWithNewAlarm(usersWhichSendingAlarmList: UserModel[], userWebsiteRelationList: UserWebsitesRelationModel[],
                                                priceIdCouple: { productId: number, priceRate: number }, yesterdayProduct: ProductPriceHistoryModel,
                                                todayProduct: ProductPriceHistoryModel) {

        let websiteService = new WebsiteService()
        let productHistoryService = new ProductHistoryService()
        let userService = new UserService()

        for (const userWebsiteRelation of userWebsiteRelationList) {

            let website = userWebsiteRelation.website;
            let alarmValue = priceIdCouple.priceRate;
            let userId = userWebsiteRelation.userId;

            let userIndex = usersWhichSendingAlarmList.findIndex(user => user.userId === userId);

            //get website currency
            let websiteService = new WebsiteService()
            let websiteEntity = await websiteService.getWebsiteByUrl(website)

            console.log("userIndex = " + userIndex + "  UserId = " + userId)

            //if user exists
            if (userIndex > -1) {
                // @ts-ignore
                let todayProductVariant = todayProduct.variants.find(variant => variant.id === priceIdCouple.productId)
                // @ts-ignore
                let yesterdayProductVariant = yesterdayProduct.variants.find(variant => variant.id === priceIdCouple.productId)

                let productHistory = await productHistoryService.getProductHistoryByProductId(todayProduct.id)

                // @ts-ignore
                let newAlarmJson = {website: website, url: productHistory.url, newValue: todayProductVariant.price, oldValue: yesterdayProductVariant.price, priceChangeRate: priceIdCouple.priceRate, productTitle: todayProductVariant.title, src: productHistory?.images[0]?.src, currency: websiteEntity.cart.currency}

                usersWhichSendingAlarmList[userIndex].cachedAlarm?.push(newAlarmJson)
            } else {

                // @ts-ignore
                let todayProductVariant = todayProduct.variants.find(variant => variant.id === priceIdCouple.productId)
                // @ts-ignore
                let yesterdayProductVariant = yesterdayProduct.variants.find(variant => variant.id === priceIdCouple.productId)

                let productHistory = await productHistoryService.getProductHistoryByProductId(todayProduct.id)

                console.log(productHistory)
                // @ts-ignore
                let newAlarmJson = {website: website, url: productHistory.url, newValue: todayProductVariant.price, oldValue: yesterdayProductVariant.price, priceChangeRate: priceIdCouple.priceRate, productTitle: todayProductVariant.title, src: productHistory?.images[0]?.src, currency: websiteEntity.cart.currency}

                let user = await userService.getUserByUserId(userId)

                usersWhichSendingAlarmList.push({userId: userId, cachedAlarm: [newAlarmJson], mail: user.mail})
            }
        }
    }
}
