"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_service_1 = require("../database.service");
class StoreRepository {
    /***
     * get Store
     * @param storeId
     */
    async getStoreByStoreId(storeId) {
        var _a;
        // @ts-ignore
        return await ((_a = database_service_1.collections.storeModel) === null || _a === void 0 ? void 0 : _a.findOne({ id: storeId }));
    }
}
exports.default = StoreRepository;
