import { collections } from '../database.service';
import { getTodayMidnight, getTomorrowMidnight, getYesterdayMidnight } from '../utility/dayUtility';
import { urlFormatter } from '../utility/stringUtility';
import ProductPriceHistoryModel from '../model/productPriceHistoryModel';

export default class ProductPriceHistoryRepository {

    /***
     * save Product by url
     * @param products
     */
    async saveProductPricesFromWebByUrl(products: object[]) {
        try {
            if (products.length > 0) {
                // @ts-ignore
                await this.removeTodayProductsByWebsite(products[0].website)
                await collections.productPriceHistoryModel?.insertMany(products);

            }
        } catch (e) {

        }
    }

    /***
     * get Product History By days and website
     * @param website website
     */
    async getProductHistoryByDaysAndWebsiteYesterday(website: string): Promise<ProductPriceHistoryModel[]> {
        //find example = { $and: [ { website:"https://www.pipsnacks.com/" }, {created_date_time : { $gte : new ISODate("2022-05-04T00:00:00.000Z") } } ] }

        website = urlFormatter(website);
        let yesterdayMidnight = getYesterdayMidnight();
        let todayMidnight = getTodayMidnight();

        let findJson = { $and: [{ website: website }, { created_date_time: { $gte: yesterdayMidnight, $lt: todayMidnight } }] };

        // @ts-ignore
        return await collections.productPriceHistoryModel?.find(findJson).sort({ id: 1, created_date_time: -1 }).toArray() as ProductPriceHistoryModel[];
    }

    /***
     * get Product History By days and website
     * @param website website
     */
    async getProductHistoryByDaysAndWebsiteToday(website: string): Promise<ProductPriceHistoryModel[]> {
        //find example = { $and: [ { website:"https://www.pipsnacks.com/" }, {created_date_time : { $gte : new ISODate("2022-05-04T00:00:00.000Z") } } ] }

        website = urlFormatter(website);
        let yesterdayMidnight = getYesterdayMidnight();
        let todayMidnight = getTodayMidnight();
        let tomorrowMidnight = getTomorrowMidnight();

        let findJson = { $and: [{ website: website }, { created_date_time: { $gte: todayMidnight, $lt: tomorrowMidnight } }] };

        // @ts-ignore
        return await collections.productPriceHistoryModel?.find(findJson).sort({ id: 1, created_date_time: -1 }).toArray() as ProductPriceHistoryModel[];
    }

    /***
     * remove Today Products
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
        await collections.productPriceHistoryModel?.deleteMany({ created_date_time: { $gte: start, $lt: end } });

    }

    /***
     * remove Today Products
     */
    async removeTodayProductsByWebsite(website:string) {
        let start = new Date();
        start.setUTCHours(0, 0, 0, 0);

        let end = new Date();
        end.setUTCHours(23, 59, 59, 999);


        // @ts-ignore
        start.setDate(start.getDate() - process.env.CRAWL_MINUS_TODAY);
        // @ts-ignore
        end.setDate(end.getDate() - process.env.CRAWL_MINUS_TODAY);

        let findJson = { $and: [{ website: website }, { created_date_time: { $gte: start, $lt: end } }] }
        await collections.productPriceHistoryModel?.deleteMany(findJson);

    }
}
