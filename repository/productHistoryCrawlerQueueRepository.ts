import { collections } from '../database.service';
import ProductHistoryCrawlerQueueModel from '../model/productHistoryCrawlerQueueModel';
import ProductHistoryService from '../service/productHistoryService';

export default class ProductHistoryCrawlerQueueRepository {

    /***
     * save Product by url
     * @param product
     */
    async saveProductPricesFromWebByUrlIfNotExists(product: ProductHistoryCrawlerQueueModel) {
        let productHistoryService = new ProductHistoryService();

        let isCrawledToday = await productHistoryService.isCrawledTodayByWebsite(product.website);

        if (isCrawledToday) {
            return;
        }

        let query = { website: product.website };
        let newRecord = { $set: { website: product.website } };

        // @ts-ignore
        await collections.productHistoryCrawlerQueueModel.updateOne(query, newRecord, { upsert: true });
    }

    async removeProductPricesFromWebByUrl(product: string) {
        await collections.productHistoryCrawlerQueueModel?.deleteMany({ website: product });
    }

}
