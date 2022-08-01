"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const storeRepository_1 = __importDefault(require("../repository/storeRepository"));
class StoreService {
    /***
     * get Store
     * @param storeId
     */
    async getStoreByStoreId(storeId) {
        let storeRepository = new storeRepository_1.default();
        return await storeRepository.getStoreByStoreId(storeId);
    }
}
exports.default = StoreService;
