import { collections } from '../database.service';
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
