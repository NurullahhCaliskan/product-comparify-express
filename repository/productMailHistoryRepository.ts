import { collections } from '../database.service';
import { getTodayMidnight, getTomorrowMidnight, getYesterdayMidnight } from '../utility/dayUtility';
import { urlFormatter } from '../utility/stringUtility';
import ProductPriceHistoryModel from '../model/productPriceHistoryModel';
import ProductMailHistoryModel from '../model/productMailHistoryModel';

export default class ProductMailHistoryRepository {

    /***
     * save Product by url
     * @param products
     */
    async saveProductMailHistory(products: ProductMailHistoryModel) {
        try {
                await collections.productMailHistoryModel?.insertOne(products);

        } catch (e) {

        }
    }



}
