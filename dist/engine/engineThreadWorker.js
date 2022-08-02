"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productHistoryService_1 = __importDefault(require("../service/productHistoryService"));
const currencyService_1 = __importDefault(require("../service/currencyService"));
async function scrap(websites) {
    let productHistoryService = new productHistoryService_1.default();
    let currencyService = new currencyService_1.default();
    await currencyService.refreshCurrencyList();
    for (const website of websites) {
        await productHistoryService.saveProductsFromWebByUrl(website);
    }
}
exports.default = scrap;
