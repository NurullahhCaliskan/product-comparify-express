import StoreWebsitesRelationModel from '../model/storeWebsitesRelationModel';
import StoreModel from '../model/storeModel';
import WebsiteService from '../service/websiteService';
import ProductPriceHistoryModel from '../model/productPriceHistoryModel';
import ProductHistoryService from '../service/productHistoryService';
import StoreService from '../service/storeService';

export default class AlarmService {

    async setToUserCachedAlarm(usersWhichSendingAlarmList: StoreModel[], userWebsiteRelationList: StoreWebsitesRelationModel[],
                               priceRate: number, yesterdayProduct: ProductPriceHistoryModel,
                               todayProduct: ProductPriceHistoryModel) {



            let newUserWebsiteRelationList = [] as StoreWebsitesRelationModel[];
            //if priceRateCoupleEntity = 0 means nothing change
            if (priceRate > 0) {
                newUserWebsiteRelationList.push(...userWebsiteRelationList.filter(entity => priceRate > entity.value));

            }
            else if (priceRate < 0) {
                newUserWebsiteRelationList.push(...userWebsiteRelationList.filter(entity => -1*priceRate > entity.value));
            }

            if (newUserWebsiteRelationList.length > 0) {
                await AlarmService.mergeUsersWithNewAlarm(usersWhichSendingAlarmList, newUserWebsiteRelationList, priceRate, yesterdayProduct, todayProduct);
            }



    }


    private static async mergeUsersWithNewAlarm(storesWhichSendingAlarmList: StoreModel[], userWebsiteRelationList: StoreWebsitesRelationModel[],
                                                priceRate: number, yesterdayProduct: ProductPriceHistoryModel,
                                                todayProduct: ProductPriceHistoryModel) {

        let websiteService = new WebsiteService();
        let productHistoryService = new ProductHistoryService();
        let storeService = new StoreService();

        for (const userWebsiteRelation of userWebsiteRelationList) {

            let website = userWebsiteRelation.website;
            let storeId = userWebsiteRelation.storeId;

            let storeIndex = storesWhichSendingAlarmList.findIndex(user => user.id === storeId);

            //get website currency
            let websiteService = new WebsiteService();
            let websiteEntity = await websiteService.getWebsiteByUrl(website);

            //if user exists
            if (storeIndex > -1) {

                let todayProductVariant = todayProduct.variants[0]

                // @ts-ignore
                let yesterdayProductVariant = yesterdayProduct.variants.find(variant => variant.id == todayProductVariant.id);

                let productHistory = await productHistoryService.getProductHistoryByProductId(todayProduct.id);

                // @ts-ignore
                let newAlarmJson = { website: website, url: productHistory.url, newValue: todayProductVariant.price, oldValue: yesterdayProductVariant.price, priceChangeRate: priceRate, productTitle: todayProductVariant.parent_title + ' - ' + todayProductVariant.title   , src: productHistory?.images[0]?.src, currency: websiteEntity.cart.currency,newValueAsUsd:todayProductVariant.compare_at_price_usd,oldValueAsUsd:yesterdayProductVariant.compare_at_price_usd  };

                storesWhichSendingAlarmList[storeIndex].cachedAlarm?.push(newAlarmJson);
            } else {

                let todayProductVariant = todayProduct.variants[0]

                // @ts-ignore
                let yesterdayProductVariant = yesterdayProduct.variants.find(variant => variant.id == todayProductVariant.id);

                let productHistory = await productHistoryService.getProductHistoryByProductId(todayProduct.id);

                // @ts-ignore
                let newAlarmJson = { website: website, url: productHistory.url, newValue: todayProductVariant.price, oldValue: yesterdayProductVariant.price, priceChangeRate: priceRate, productTitle: todayProductVariant.parent_title + ' - ' + todayProductVariant.title, src: productHistory?.images[0]?.src, currency: websiteEntity.cart.currency,newValueAsUsd:todayProductVariant.compare_at_price_usd,oldValueAsUsd:yesterdayProductVariant.compare_at_price_usd };

                let storeModel = await storeService.getStoreByStoreId(storeId);

                storesWhichSendingAlarmList.push({ id: storeId, cachedAlarm: [newAlarmJson], selectedMail: storeModel.selectedMail });
            }
        }
    }
}
