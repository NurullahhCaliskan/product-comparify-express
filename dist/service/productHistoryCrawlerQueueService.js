"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productHistoryCrawlerQueueRepository_1 = __importDefault(require("../repository/productHistoryCrawlerQueueRepository"));
class ProductHistoryCrawlerQueueService {
    /**
     * Remoce Product Price from web by url
     * @param website
     */
    async removeProductQueueByUrl(website) {
        let productHistoryCrawlerQueueRepository = new productHistoryCrawlerQueueRepository_1.default();
        await productHistoryCrawlerQueueRepository.removeProductQueueByUrl(website);
    }
}
exports.default = ProductHistoryCrawlerQueueService;
