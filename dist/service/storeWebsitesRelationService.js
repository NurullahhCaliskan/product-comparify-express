"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const storeWebsitesRelationRepository_1 = __importDefault(require("../repository/storeWebsitesRelationRepository"));
class StoreWebsitesRelationService {
    /**
     * get User Website Relations
     */
    async getUserWebsitesRelations() {
        let storeWebsitesRelationRepository = new storeWebsitesRelationRepository_1.default();
        return await storeWebsitesRelationRepository.getStoreWebsitesRelations();
    }
    getStoreFilterWebsiteAndAlarmStatus(storeWebsiteRelationList, website) {
        return storeWebsiteRelationList.filter(entity => entity.website === website && entity.alarm);
    }
}
exports.default = StoreWebsitesRelationService;
