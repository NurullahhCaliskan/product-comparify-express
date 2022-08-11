import { collections } from '../database.service';
import { getTodayAsNumber, getTodayMidnight, getTomorrowMidnight, getYesterdayAsNumber, getYesterdayMidnight } from '../utility/dayUtility';
import { urlFormatter } from '../utility/stringUtility';
import ProductPriceHistoryModel from '../model/productPriceHistoryModel';
import ProductPriceHistoryWithCompareModel from '../model/productPriceHistoryWithCompareModel';

export default class ProductPriceHistoryRepository {

    /***
     * save Product by url
     * @param products
     */
    async saveProductPricesFromWebByUrl(products: object[]) {
        try {
            if (products.length > 0) {
                // @ts-ignore
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
        return await collections.productPriceHistoryModel?.find(findJson).sort({ id: 1, created_date_time: -1 }).allowDiskUse().toArray() as ProductPriceHistoryModel[];
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
        return await collections.productPriceHistoryModel?.find(findJson).sort({ id: 1, created_date_time: -1 }).allowDiskUse().toArray() as ProductPriceHistoryModel[];
    }

    /***
     * get Product History By days and website
     * @param website website
     */
    async getProductHistoryWithCompare(website: string): Promise<ProductPriceHistoryWithCompareModel[]> {
        let today = getTodayAsNumber();
        let yesterday = getYesterdayAsNumber();
        // @ts-ignore
        return await collections.productPriceHistoryModel?.aggregate([
            { $match: { $and: [{ website: website }, { timestamp_id: today }] } },
            {
                $lookup: {
                    from: 'product-price-history',
                    localField: 'id',
                    foreignField: 'id',
                    as: 'productPriceHistoryYesterday',

                },
            },
            { $unwind: '$productPriceHistoryYesterday' },
            { $match: { 'productPriceHistoryYesterday.timestamp_id': yesterday } },
            {
                $project: {
                    today_id: '$id',
                    today_website: '$website',
                    today_currency: '$currency',
                    today_created_date_time: '$created_date_time',
                    today_timestamp_id: '$timestamp_id',
                    today_variant: { $arrayElemAt: ['$variants', 0] },
                    yesterday_id: '$productPriceHistoryYesterday.id',
                    yesterday_website: '$productPriceHistoryYesterday.website',
                    yesterday_currency: '$productPriceHistoryYesterday.currency',
                    yesterday_created_date_time: '$productPriceHistoryYesterday.created_date_time',
                    yesterday_timestamp_id: '$productPriceHistoryYesterday.timestamp_id',
                    yesterday_variant: { $arrayElemAt: ['$productPriceHistoryYesterday.variants', 0] },
                },
            },
            { $match: { $expr: { $ne: ['$today_variant.price', '$yesterday_variant.price'] } } },
            { $limit: 50 },
        ], {
            allowDiskUse: true,
        }).toArray();
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
