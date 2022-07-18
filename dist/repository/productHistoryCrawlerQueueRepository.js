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
    saveProductPricesFromWebByUrlIfNotExists(product) {
        return __awaiter(this, void 0, void 0, function* () {
            let productHistoryService = new productHistoryService_1.default();
            let isCrawledToday = yield productHistoryService.isCrawledTodayByWebsite(product.website);
            if (isCrawledToday) {
                return;
            }
            let query = { website: product.website };
            let newRecord = { $set: { website: product.website } };
            // @ts-ignore
            yield database_service_1.collections.productHistoryCrawlerQueueModel.updateOne(query, newRecord, { upsert: true });
        });
    }
    /**
     * Remoce Product Price from web by url
     * @param website
     */
    removeProductPricesFromWebByUrl(product) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = database_service_1.collections.productHistoryCrawlerQueueModel) === null || _a === void 0 ? void 0 : _a.deleteMany({ website: product }));
        });
    }
}
exports.default = ProductHistoryCrawlerQueueRepository;
