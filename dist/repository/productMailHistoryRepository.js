"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_service_1 = require("../database.service");
class ProductMailHistoryRepository {
    /***
     * save Product by url
     * @param products
     */
    async saveProductMailHistory(products) {
        var _a;
        try {
            await ((_a = database_service_1.collections.productMailHistoryModel) === null || _a === void 0 ? void 0 : _a.insertOne(products));
        }
        catch (e) {
        }
    }
}
exports.default = ProductMailHistoryRepository;
