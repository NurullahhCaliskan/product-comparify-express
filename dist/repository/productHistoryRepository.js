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
class ProductHistoryRepository {
    /***
     * save Product by url
     * @param products
     */
    saveProductsFromWebByUrl(products) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = database_service_1.collections.productHistoryModel) === null || _a === void 0 ? void 0 : _a.insertMany(products));
        });
    }
    /***
     * get Product History By days and website
     * @param website website
     */
    getProductHistoryByDaysAndWebsite(website) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            //find example = { $and: [ { website:"https://www.pipsnacks.com/" }, {created_date_time : { $gte : new ISODate("2022-05-04T00:00:00.000Z") } } ] }
            website = (0, stringUtility_1.urlFormatter)(website);
            let yesterdayMidnight = (0, dayUtility_1.getYesterdayMidnight)();
            let todayMidnight = (0, dayUtility_1.getTodayMidnight)();
            let findJson = { $and: [{ website: website }, { created_date_time: { $gte: yesterdayMidnight } }] };
            // @ts-ignore
            return yield ((_a = database_service_1.collections.productHistoryModel) === null || _a === void 0 ? void 0 : _a.find(findJson).sort({ id: 1, created_date_time: -1 }).toArray());
        });
    }
}
exports.default = ProductHistoryRepository;
