import { collections } from '../database.service';
import ProductHistoryModel from '../model/productHistoryModel';
import _ from 'lodash';
import { logger } from '../utility/logUtility';

export default class ProductHistoryRepository {

    /***
     * save product
     * @param products
     */
    async saveProductsFromWebByUrl(products: object[]) {
        try {
            if (products.length > 0) {

                // @ts-ignore
                await collections.productHistoryModel?.insertMany(products);
            }

        } catch (e) {
            logger.info(__filename + e  );
        }
    }

    /***
     * remove Today products
     * NOTE: minus day information in env file
     */
    async removeTodayProducts() {
        let start = new Date();
        start.setUTCHours(0, 0, 0, 0);

        let end = new Date();
        end.setUTCHours(23, 59, 59, 999);

        // @ts-ignore
        start.setDate(start.getDate() - process.env.CRAWL_MINUS_TODAY);
        // @ts-ignore
        end.setDate(end.getDate() - process.env.CRAWL_MINUS_TODAY);
        await collections.productHistoryModel?.deleteMany({ created_date_time: { $gte: start, $lt: end } });
    }

    /***
     * remove   products
     */
    async removeProductsByWebsite(website:string) {

        let findJson ={ website: website };
        await collections.productHistoryModel?.deleteMany(findJson);
    }

    /***
     * get Product History By Product Id
     * @param id
     */
    async getProductHistoryByProductId(id: number): Promise<ProductHistoryModel> {

        return await collections.productHistoryModel?.findOne({ id: id }) as ProductHistoryModel;
    }

    /***
     * delete product
     * @param website
     */
    async deleteProductsByWebsite(website: string) {
        await collections.productHistoryModel?.deleteMany({ website: website });
    }

    /***
     * today crawled check
     * @param website
     */
    async isCrawledTodayByWebsite(website: string): Promise<boolean> {
        let start = new Date();
        start.setUTCHours(0, 0, 0, 0);

        let end = new Date();
        end.setUTCHours(23, 59, 59, 999);

        let result = await collections.productHistoryModel?.findOne({ created_date_time: { $gte: start, $lt: end }, website: website }) as ProductHistoryModel;

        return !_.isEmpty(result);
    }
}
