"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productPriceHistoryRepository_1 = __importDefault(require("../repository/productPriceHistoryRepository"));
class ProductPriceHistoryService {
    /***local
     * get Product History data
     * @param website website
     */
    async getProductHistoryByDaysAndWebsiteYesterday(website) {
        let productHistoryRepository = new productPriceHistoryRepository_1.default();
        return await productHistoryRepository.getProductHistoryByDaysAndWebsiteYesterday(website);
    }
    /***
     * get Product History data
     * @param website website
     */
    async getProductHistoryByDaysAndWebsiteToday(website) {
        let productHistoryRepository = new productPriceHistoryRepository_1.default();
        return await productHistoryRepository.getProductHistoryByDaysAndWebsiteToday(website);
    }
    async saveProductPriceHistory(website) {
        let productHistoryRepository = new productPriceHistoryRepository_1.default();
        await productHistoryRepository.saveProductPricesFromWebByUrl(website);
    }
    async removeTodayProducts() {
        let productHistoryRepository = new productPriceHistoryRepository_1.default();
        await productHistoryRepository.removeTodayProducts();
    }
    async removeTodayProductsByWebsite(website) {
        let productHistoryRepository = new productPriceHistoryRepository_1.default();
        await productHistoryRepository.removeTodayProductsByWebsite(website);
    }
}
exports.default = ProductPriceHistoryService;
