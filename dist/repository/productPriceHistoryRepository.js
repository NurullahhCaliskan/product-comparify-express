"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_service_1 = require("../database.service");
const dayUtility_1 = require("../utility/dayUtility");
const stringUtility_1 = require("../utility/stringUtility");
class ProductPriceHistoryRepository {
    /***
     * save Product by url
     * @param products
     */
    async saveProductPricesFromWebByUrl(products) {
        var _a;
        try {
            if (products.length > 0) {
                // @ts-ignore
                await ((_a = database_service_1.collections.productPriceHistoryTodayModel) === null || _a === void 0 ? void 0 : _a.insertMany(products));
            }
        }
        catch (e) {
        }
    }
    /***
     * get Product History By days and website
     * @param website website
     */
    async getProductHistoryByDaysAndWebsiteYesterday(website) {
        //find example = { $and: [ { website:"https://www.pipsnacks.com/" }, {created_date_time : { $gte : new ISODate("2022-05-04T00:00:00.000Z") } } ] }
        var _a;
        website = (0, stringUtility_1.urlFormatter)(website);
        let yesterdayMidnight = (0, dayUtility_1.getYesterdayMidnight)();
        let todayMidnight = (0, dayUtility_1.getTodayMidnight)();
        let findJson = { $and: [{ website: website }, { created_date_time: { $gte: yesterdayMidnight, $lt: todayMidnight } }] };
        // @ts-ignore
        return await ((_a = database_service_1.collections.productPriceHistoryTodayModel) === null || _a === void 0 ? void 0 : _a.find(findJson).sort({ id: 1, created_date_time: -1 }).allowDiskUse().toArray());
    }
    /***
     * get Product History By days and website
     * @param website website
     */
    async getProductHistoryByDaysAndWebsiteToday(website) {
        //find example = { $and: [ { website:"https://www.pipsnacks.com/" }, {created_date_time : { $gte : new ISODate("2022-05-04T00:00:00.000Z") } } ] }
        var _a;
        website = (0, stringUtility_1.urlFormatter)(website);
        let yesterdayMidnight = (0, dayUtility_1.getYesterdayMidnight)();
        let todayMidnight = (0, dayUtility_1.getTodayMidnight)();
        let tomorrowMidnight = (0, dayUtility_1.getTomorrowMidnight)();
        let findJson = { $and: [{ website: website }, { created_date_time: { $gte: todayMidnight, $lt: tomorrowMidnight } }] };
        // @ts-ignore
        return await ((_a = database_service_1.collections.productPriceHistoryTodayModel) === null || _a === void 0 ? void 0 : _a.find(findJson).sort({ id: 1, created_date_time: -1 }).allowDiskUse().toArray());
    }
    /***
     * 1)Remove yesterday except yesterday
     * 2)Copy yesterday products from today to yesterday
     * 3)Remove today all
     */
    async syncPricesHistoryBeforeStartEngine() {
        var _a, _b, _c, _d;
        await ((_a = database_service_1.collections.productPriceHistoryYesterdayModel) === null || _a === void 0 ? void 0 : _a.deleteMany({ 'timestamp_id': { $ne: (0, dayUtility_1.getYesterdayAsNumber)() } }));
        if (await ((_b = database_service_1.collections.productPriceHistoryYesterdayModel) === null || _b === void 0 ? void 0 : _b.count({})) === 0) {
            await ((_c = database_service_1.collections.productPriceHistoryTodayModel) === null || _c === void 0 ? void 0 : _c.aggregate([{ $match: { timestamp_id: (0, dayUtility_1.getYesterdayAsNumber)() } }, { $out: 'product-price-history-yesterday' }]).toArray());
        }
        await ((_d = database_service_1.collections.productPriceHistoryTodayModel) === null || _d === void 0 ? void 0 : _d.deleteMany({}));
    }
    /***
     * get Product History By days and website
     * @param website website
     */
    async getProductHistoryWithCompare(website) {
        var _a;
        // @ts-ignore
        return await ((_a = database_service_1.collections.productPriceHistoryTodayModel) === null || _a === void 0 ? void 0 : _a.aggregate([
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
        }).toArray());
    }
    /***
     * remove Today Products
     */
    async removeTodayProducts() {
        var _a;
        let start = new Date();
        start.setUTCHours(0, 0, 0, 0);
        let end = new Date();
        end.setUTCHours(23, 59, 59, 999);
        // @ts-ignore
        start.setDate(start.getDate() - process.env.CRAWL_MINUS_TODAY);
        // @ts-ignore
        end.setDate(end.getDate() - process.env.CRAWL_MINUS_TODAY);
        await ((_a = database_service_1.collections.productPriceHistoryTodayModel) === null || _a === void 0 ? void 0 : _a.deleteMany({ created_date_time: { $gte: start, $lt: end } }));
    }
    /***
     * remove Today Products
     */
    async removeTodayProductsByWebsite(website) {
        var _a;
        let findJson = { $and: [{ website: website }, { timestamp_id: dayUtility_1.getTodayAsNumber }] };
        await ((_a = database_service_1.collections.productPriceHistoryTodayModel) === null || _a === void 0 ? void 0 : _a.deleteMany(findJson));
    }
}
exports.default = ProductPriceHistoryRepository;
