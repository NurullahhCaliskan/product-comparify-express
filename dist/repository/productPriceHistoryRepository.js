"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_service_1 = require("../database.service");
const dayUtility_1 = require("../utility/dayUtility");
const stringUtility_1 = require("../utility/stringUtility");
class ProductPriceHistoryRepository {
    /***
     * save Product by url
     * @param products
     */
    saveProductPricesFromWebByUrl(products) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (products.length > 0) {
                    yield ((_a = database_service_1.collections.productPriceHistoryModel) === null || _a === void 0 ? void 0 : _a.insertMany(products));
                }
            }
            catch (e) {
            }
        });
    }
    /***
     * get Product History By days and website
     * @param website website
     */
    getProductHistoryByDaysAndWebsiteYesterday(website) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            //find example = { $and: [ { website:"https://www.pipsnacks.com/" }, {created_date_time : { $gte : new ISODate("2022-05-04T00:00:00.000Z") } } ] }
            website = (0, stringUtility_1.urlFormatter)(website);
            let yesterdayMidnight = (0, dayUtility_1.getYesterdayMidnight)();
            let todayMidnight = (0, dayUtility_1.getTodayMidnight)();
            let findJson = { $and: [{ website: website }, { created_date_time: { $gte: yesterdayMidnight, $lt: todayMidnight } }] };
            // @ts-ignore
            return yield ((_a = database_service_1.collections.productPriceHistoryModel) === null || _a === void 0 ? void 0 : _a.find(findJson).sort({ id: 1, created_date_time: -1 }).toArray());
        });
    }
    /***
     * get Product History By days and website
     * @param website website
     */
    getProductHistoryByDaysAndWebsiteToday(website) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            //find example = { $and: [ { website:"https://www.pipsnacks.com/" }, {created_date_time : { $gte : new ISODate("2022-05-04T00:00:00.000Z") } } ] }
            website = (0, stringUtility_1.urlFormatter)(website);
            let yesterdayMidnight = (0, dayUtility_1.getYesterdayMidnight)();
            let todayMidnight = (0, dayUtility_1.getTodayMidnight)();
            let tomorrowMidnight = (0, dayUtility_1.getTomorrowMidnight)();
            let findJson = { $and: [{ website: website }, { created_date_time: { $gte: todayMidnight, $lt: tomorrowMidnight } }] };
            // @ts-ignore
            return yield ((_a = database_service_1.collections.productPriceHistoryModel) === null || _a === void 0 ? void 0 : _a.find(findJson).sort({ id: 1, created_date_time: -1 }).toArray());
        });
    }
    /***
     * remove Today Products
     */
    removeTodayProducts() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let start = new Date();
            start.setHours(0, 0, 0, 0);
            let end = new Date();
            end.setHours(23, 59, 59, 999);
            // @ts-ignore
            start.setDate(start.getDate() - process.env.CRAWL_MINUS_TODAY);
            // @ts-ignore
            end.setDate(end.getDate() - process.env.CRAWL_MINUS_TODAY);
            yield ((_a = database_service_1.collections.productPriceHistoryModel) === null || _a === void 0 ? void 0 : _a.deleteMany({ created_date_time: { $gte: start, $lt: end } }));
        });
    }
}
exports.default = ProductPriceHistoryRepository;
