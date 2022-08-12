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
                await collections.productPriceHistoryTodayModel?.insertMany(products);

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
        return await collections.productPriceHistoryTodayModel?.find(findJson).sort({ id: 1, created_date_time: -1 }).allowDiskUse().toArray() as ProductPriceHistoryModel[];
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
        return await collections.productPriceHistoryTodayModel?.find(findJson).sort({ id: 1, created_date_time: -1 }).allowDiskUse().toArray() as ProductPriceHistoryModel[];
    }

    /***
     * 1)Remove yesterday except yesterday
     * 2)Copy yesterday products from today to yesterday
     * 3)Remove today all
     */
    async syncPricesHistoryBeforeStartEngine() {

        await collections.productPriceHistoryYesterdayModel?.deleteMany({ 'timestamp_id': { $ne: getYesterdayAsNumber() } });

        if (await collections.productPriceHistoryYesterdayModel?.count({}) === 0) {

            await collections.productPriceHistoryTodayModel?.aggregate([{ $match: { timestamp_id: getYesterdayAsNumber() } }, { $out: 'product-price-history-yesterday' }]).toArray();
        }

        await collections.productPriceHistoryTodayModel?.deleteMany({});

    }

    /***
     * get Product History By days and website
     * @param website website
     */
    async getProductHistoryWithCompare(website: string): Promise<ProductPriceHistoryWithCompareModel[]> {
        // @ts-ignore
        return await collections.productPriceHistoryTodayModel?.aggregate([
            { $match: { website: website } },
            {
                $lookup: {
                    from: 'product-price-history-yesterday',
                    localField: 'id',
                    foreignField: 'id',
                    as: 'productPriceHistoryYesterday',

                },
            },
            { $unwind: '$productPriceHistoryYesterday' },
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
        await collections.productPriceHistoryTodayModel?.deleteMany({ created_date_time: { $gte: start, $lt: end } });

    }

    /***
     * remove Today Products
     */
    async removeTodayProductsByWebsite(website:string) {

        let findJson = { $and: [{ website: website }, { timestamp_id: getTodayAsNumber }] };
        await collections.productPriceHistoryTodayModel?.deleteMany(findJson);

    }
}
