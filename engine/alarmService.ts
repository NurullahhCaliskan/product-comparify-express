import StoreWebsitesRelationModel from '../model/storeWebsitesRelationModel';
import StoreModel from '../model/storeModel';
import WebsiteService from '../service/websiteService';
import ProductPriceHistoryModel from '../model/productPriceHistoryModel';
import ProductHistoryService from '../service/productHistoryService';
import StoreService from '../service/storeService';

export default class AlarmService {

    async setToUserCachedAlarm(usersWhichSendingAlarmList: StoreModel[], userWebsiteRelationList: StoreWebsitesRelationModel[],
                               priceIdCouple: [{ productId: number, priceRate: number }], yesterdayProduct: ProductPriceHistoryModel,
                               todayProduct: ProductPriceHistoryModel) {

        for (const priceRateCoupleEntity of priceIdCouple) {

            let newUserWebsiteRelationList = [] as StoreWebsitesRelationModel[];
            //if priceRateCoupleEntity = 0 means nothing change
            if (priceRateCoupleEntity.priceRate > 0) {
                newUserWebsiteRelationList.push(...userWebsiteRelationList.filter(entity => priceRateCoupleEntity.priceRate > entity.value));

            }
            else if (priceRateCoupleEntity.priceRate < 0) {
                newUserWebsiteRelationList.push(...userWebsiteRelationList.filter(entity => -1*priceRateCoupleEntity.priceRate > entity.value));
            }

            if (newUserWebsiteRelationList.length > 0) {
                await AlarmService.mergeUsersWithNewAlarm(usersWhichSendingAlarmList, newUserWebsiteRelationList, priceRateCoupleEntity, yesterdayProduct, todayProduct);
            }

        }
    }


    private static async mergeUsersWithNewAlarm(storesWhichSendingAlarmList: StoreModel[], userWebsiteRelationList: StoreWebsitesRelationModel[],
                                                priceIdCouple: { productId: number, priceRate: number }, yesterdayProduct: ProductPriceHistoryModel,
                                                todayProduct: ProductPriceHistoryModel) {

        let websiteService = new WebsiteService();
        let productHistoryService = new ProductHistoryService();
        let storeService = new StoreService();

        for (const userWebsiteRelation of userWebsiteRelationList) {

            let website = userWebsiteRelation.website;
            let alarmValue = priceIdCouple.priceRate;
            let storeId = userWebsiteRelation.storeId;

            let storeIndex = storesWhichSendingAlarmList.findIndex(user => user.id === storeId);

            //get website currency
            let websiteService = new WebsiteService();
            let websiteEntity = await websiteService.getWebsiteByUrl(website);

            console.log('storeIndex = ' + storeIndex + '  UserId = ' + storeId);

            //if user exists
            if (storeIndex > -1) {
                // @ts-ignore
                let todayProductVariant = todayProduct.variants.find(variant => variant.id === priceIdCouple.productId);
                // @ts-ignore
                let yesterdayProductVariant = yesterdayProduct.variants.find(variant => variant.id === priceIdCouple.productId);

                let productHistory = await productHistoryService.getProductHistoryByProductId(todayProduct.id);

                // @ts-ignore
                let newAlarmJson = { website: website, url: productHistory.url, newValue: todayProductVariant.price, oldValue: yesterdayProductVariant.price, priceChangeRate: priceIdCouple.priceRate, productTitle: todayProductVariant.parent_title + ' - ' + todayProductVariant.title   , src: productHistory?.images[0]?.src, currency: websiteEntity.cart.currency,newValueAsUsd:todayProductVariant.compare_at_price_usd,oldValueAsUsd:yesterdayProductVariant.compare_at_price_usd  };

                storesWhichSendingAlarmList[storeIndex].cachedAlarm?.push(newAlarmJson);
            } else {

                // @ts-ignore
                let todayProductVariant = todayProduct.variants.find(variant => variant.id === priceIdCouple.productId);
                // @ts-ignore
                let yesterdayProductVariant = yesterdayProduct.variants.find(variant => variant.id === priceIdCouple.productId);

                let productHistory = await productHistoryService.getProductHistoryByProductId(todayProduct.id);

                console.log(productHistory);
                // @ts-ignore
                let newAlarmJson = { website: website, url: productHistory.url, newValue: todayProductVariant.price, oldValue: yesterdayProductVariant.price, priceChangeRate: priceIdCouple.priceRate, productTitle: todayProductVariant.parent_title + ' - ' + todayProductVariant.title, src: productHistory?.images[0]?.src, currency: websiteEntity.cart.currency,newValueAsUsd:todayProductVariant.compare_at_price_usd,oldValueAsUsd:yesterdayProductVariant.compare_at_price_usd };

                let storeModel = await storeService.getStoreByStoreId(storeId);

                storesWhichSendingAlarmList.push({ id: storeId, cachedAlarm: [newAlarmJson], selectedMail: storeModel.selectedMail });
            }
        }
    }
}
