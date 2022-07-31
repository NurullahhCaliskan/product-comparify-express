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
const lodash_1 = __importDefault(require("lodash"));
class ProductHistoryRepository {
    /***
     * save product
     * @param products
     */
    saveProductsFromWebByUrl(products) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (products.length > 0) {
                    // @ts-ignore
                    yield this.removeTodayProductsByWebsite(products[0].website);
                    yield ((_a = database_service_1.collections.productHistoryModel) === null || _a === void 0 ? void 0 : _a.insertMany(products));
                }
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    /***
     * remove Today products
     * NOTE: minus day information in env file
     */
    removeTodayProducts() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let start = new Date();
            start.setUTCHours(0, 0, 0, 0);
            let end = new Date();
            end.setUTCHours(23, 59, 59, 999);
            // @ts-ignore
            start.setDate(start.getDate() - process.env.CRAWL_MINUS_TODAY);
            // @ts-ignore
            end.setDate(end.getDate() - process.env.CRAWL_MINUS_TODAY);
            yield ((_a = database_service_1.collections.productHistoryModel) === null || _a === void 0 ? void 0 : _a.deleteMany({ created_date_time: { $gte: start, $lt: end } }));
        });
    }
    /***
     * remove Today products
     * NOTE: minus day information in env file
     */
    removeTodayProductsByWebsite(website) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let start = new Date();
            start.setUTCHours(0, 0, 0, 0);
            let end = new Date();
            end.setUTCHours(23, 59, 59, 999);
            // @ts-ignore
            start.setDate(start.getDate() - process.env.CRAWL_MINUS_TODAY);
            // @ts-ignore
            end.setDate(end.getDate() - process.env.CRAWL_MINUS_TODAY);
            let findJson = { $and: [{ website: website }, { created_date_time: { $gte: start, $lt: end } }] };
            yield ((_a = database_service_1.collections.productHistoryModel) === null || _a === void 0 ? void 0 : _a.deleteMany(findJson));
        });
    }
    /***
     * get Product History By Product Id
     * @param id
     */
    getProductHistoryByProductId(id) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return yield ((_a = database_service_1.collections.productHistoryModel) === null || _a === void 0 ? void 0 : _a.findOne({ id: id }));
        });
    }
    /***
     * delete product
     * @param website
     */
    deleteProductsByWebsite(website) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = database_service_1.collections.productHistoryModel) === null || _a === void 0 ? void 0 : _a.deleteMany({ website: website }));
        });
    }
    /***
     * today crawled check
     * @param website
     */
    isCrawledTodayByWebsite(website) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let start = new Date();
            start.setUTCHours(0, 0, 0, 0);
            let end = new Date();
            end.setUTCHours(23, 59, 59, 999);
            let result = yield ((_a = database_service_1.collections.productHistoryModel) === null || _a === void 0 ? void 0 : _a.findOne({ created_date_time: { $gte: start, $lt: end }, website: website }));
            return !lodash_1.default.isEmpty(result);
        });
    }
}
exports.default = ProductHistoryRepository;
