"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productHistoryService_1 = __importDefault(require("../service/productHistoryService"));
async function scrap(websites) {
    let productHistoryService = new productHistoryService_1.default();
    for (const website of websites) {
        //await productHistoryService.saveProductsFromWebByUrl(website);
    }
}
exports.default = scrap;
