import UserWebsitesRelationModel from "../model/userWebsitesRelationModel";
import UserModel from "../model/userModel";
import ProductHistoryModel from "../model/productHistoryModel";

export default class AlarmService {

    setToUserCachedAlarm(usersWhichSendingAlarmList: UserModel[], userWebsiteRelationList: UserWebsitesRelationModel[],
                         priceIdCouple: [{ productId: number, priceRate: number }], yesterdayProduct: ProductHistoryModel,
                         todayProduct: ProductHistoryModel) {


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

                AlarmService.mergeUsersWithNewAlarm(usersWhichSendingAlarmList, newUserWebsiteRelationList, priceRateCoupleEntity, yesterdayProduct, todayProduct)
            }

        }
    }


    private static mergeUsersWithNewAlarm(usersWhichSendingAlarmList: UserModel[], userWebsiteRelationList: UserWebsitesRelationModel[],
                                          priceIdCouple: { productId: number, priceRate: number }, yesterdayProduct: ProductHistoryModel,
                                          todayProduct: ProductHistoryModel) {

        for (const userWebsiteRelation of userWebsiteRelationList) {
            let website = userWebsiteRelation.website;
            let alarmValue = priceIdCouple.priceRate;
            let userId = userWebsiteRelation.userId;

            let userIndex = usersWhichSendingAlarmList.findIndex(user => user.userId === userId);

            //if user exists
            if (userIndex > 0) {
                // @ts-ignore
                let todayProductVariant = todayProduct.variants.find(variant => variant.id === priceIdCouple.productId)
                // @ts-ignore
                let yesterdayProductVariant = yesterdayProduct.variants.find(variant => variant.id === priceIdCouple.productId)

                // @ts-ignore
                let newAlarmJson = {website: website, url: yesterdayProduct.url, newValue: todayProductVariant.price, oldValue: yesterdayProductVariant.price, priceChangeRate: priceIdCouple.priceRate, productTitle: todayProductVariant.title}


                usersWhichSendingAlarmList[userIndex].cachedAlarm?.push(newAlarmJson)
            }else{

                // @ts-ignore
                let todayProductVariant = todayProduct.variants.find(variant => variant.id === priceIdCouple.productId)
                // @ts-ignore
                let yesterdayProductVariant = yesterdayProduct.variants.find(variant => variant.id === priceIdCouple.productId)

                // @ts-ignore
                let newAlarmJson = {website: website, url: yesterdayProduct.url, newValue: todayProductVariant.price, oldValue: yesterdayProductVariant.price, priceChangeRate: priceIdCouple.priceRate, productTitle: todayProductVariant.title}


                usersWhichSendingAlarmList.push({userId:userId , cachedAlarm:[newAlarmJson]})
            }
        }
    }
}
