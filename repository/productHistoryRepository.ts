import { collections } from '../database.service';
import { getTodayMidnight, getTomorrowMidnight, getYesterdayMidnight } from '../utility/dayUtility';
import ProductHistoryModel from '../model/productHistoryModel';
import { urlFormatter } from '../utility/stringUtility';
import WebsiteModel from '../model/websiteModel';
import _ from 'lodash';

export default class ProductHistoryRepository {

    /***
     * save Product by url
     * @param products
     */
    async saveProductsFromWebByUrl(products: object[]) {
        try {
            if (products.length > 0) {
                await collections.productHistoryModel?.insertMany(products);
            }

        } catch (e) {
            console.log(e);
        }
    }

    async removeTodayProducts() {
        let start = new Date();
        start.setHours(0, 0, 0, 0);

        let end = new Date();
        end.setHours(23, 59, 59, 999);

        // @ts-ignore
        start.setDate(start.getDate() - process.env.CRAWL_MINUS_TODAY);
        // @ts-ignore
        end.setDate(end.getDate() - process.env.CRAWL_MINUS_TODAY);
        await collections.productHistoryModel?.deleteMany({ created_date_time: { $gte: start, $lt: end } });
    }

    /**
     * get User websites relations
     * @return unique website list
     */
    async getProductHistoryByProductId(id: number): Promise<ProductHistoryModel> {

        return await collections.productHistoryModel?.findOne({ id: id }) as ProductHistoryModel;
    }

    async deleteProductsByWebsite(website: string) {
        await collections.productHistoryModel?.deleteMany({ website: website });
    }

    async isCrawledTodayByWebsite(website: string): Promise<boolean> {
        let start = new Date();
        start.setHours(0, 0, 0, 0);

        let end = new Date();
        end.setHours(23, 59, 59, 999);

        let result = await collections.productHistoryModel?.findOne({ created_date_time: { $gte: start, $lt: end }, website: website }) as ProductHistoryModel;


        console.log('result');
        console.log(result);
        console.log(!_.isEmpty(result));
        return !_.isEmpty(result);
    }
}
