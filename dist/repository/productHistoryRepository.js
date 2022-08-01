"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_service_1 = require("../database.service");
const lodash_1 = __importDefault(require("lodash"));
class ProductHistoryRepository {
    /***
     * save product
     * @param products
     */
    async saveProductsFromWebByUrl(products) {
        var _a;
        try {
            if (products.length > 0) {
                // @ts-ignore
                await this.removeTodayProductsByWebsite(products[0].website);
                await ((_a = database_service_1.collections.productHistoryModel) === null || _a === void 0 ? void 0 : _a.insertMany(products));
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    /***
     * remove Today products
     * NOTE: minus day information in env file
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
        await ((_a = database_service_1.collections.productHistoryModel) === null || _a === void 0 ? void 0 : _a.deleteMany({ created_date_time: { $gte: start, $lt: end } }));
    }
    /***
     * remove Today products
     * NOTE: minus day information in env file
     */
    async removeTodayProductsByWebsite(website) {
        var _a;
        let start = new Date();
        start.setUTCHours(0, 0, 0, 0);
        let end = new Date();
        end.setUTCHours(23, 59, 59, 999);
        // @ts-ignore
        start.setDate(start.getDate() - process.env.CRAWL_MINUS_TODAY);
        // @ts-ignore
        end.setDate(end.getDate() - process.env.CRAWL_MINUS_TODAY);
        let findJson = { $and: [{ website: website }, { created_date_time: { $gte: start, $lt: end } }] };
        await ((_a = database_service_1.collections.productHistoryModel) === null || _a === void 0 ? void 0 : _a.deleteMany(findJson));
    }
    /***
     * get Product History By Product Id
     * @param id
     */
    async getProductHistoryByProductId(id) {
        var _a;
        return await ((_a = database_service_1.collections.productHistoryModel) === null || _a === void 0 ? void 0 : _a.findOne({ id: id }));
    }
    /***
     * delete product
     * @param website
     */
    async deleteProductsByWebsite(website) {
        var _a;
        await ((_a = database_service_1.collections.productHistoryModel) === null || _a === void 0 ? void 0 : _a.deleteMany({ website: website }));
    }
    /***
     * today crawled check
     * @param website
     */
    async isCrawledTodayByWebsite(website) {
        var _a;
        let start = new Date();
        start.setUTCHours(0, 0, 0, 0);
        let end = new Date();
        end.setUTCHours(23, 59, 59, 999);
        let result = await ((_a = database_service_1.collections.productHistoryModel) === null || _a === void 0 ? void 0 : _a.findOne({ created_date_time: { $gte: start, $lt: end }, website: website }));
        return !lodash_1.default.isEmpty(result);
    }
}
exports.default = ProductHistoryRepository;
