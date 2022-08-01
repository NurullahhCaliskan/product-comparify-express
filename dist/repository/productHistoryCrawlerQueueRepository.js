"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_service_1 = require("../database.service");
const productHistoryService_1 = __importDefault(require("../service/productHistoryService"));
class ProductHistoryCrawlerQueueRepository {
    /***
     * save Product by url
     * @param product
     */
    async saveProductPricesFromWebByUrlIfNotExists(product) {
        let productHistoryService = new productHistoryService_1.default();
        let isCrawledToday = await productHistoryService.isCrawledTodayByWebsite(product.website);
        if (isCrawledToday) {
            return;
        }
        let query = { website: product.website };
        let newRecord = { $set: { website: product.website } };
        // @ts-ignore
        await database_service_1.collections.productHistoryCrawlerQueueModel.updateOne(query, newRecord, { upsert: true });
    }
    /**
     * Remoce Product Price from web by url
     * @param website
     */
    async removeProductQueueByUrl(product) {
        var _a;
        await ((_a = database_service_1.collections.productHistoryCrawlerQueueModel) === null || _a === void 0 ? void 0 : _a.deleteMany({ website: product }));
    }
}
exports.default = ProductHistoryCrawlerQueueRepository;
