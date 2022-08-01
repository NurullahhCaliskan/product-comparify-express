"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productMailHistoryRepository_1 = __importDefault(require("../repository/productMailHistoryRepository"));
class ProductMailHistoryService {
    async saveProductMailHistory(productPriceHistoryService) {
        let productMailHistoryRepository = new productMailHistoryRepository_1.default();
        await productMailHistoryRepository.saveProductMailHistory(productPriceHistoryService);
    }
}
exports.default = ProductMailHistoryService;
