"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_service_1 = require("../database.service");
class StoreWebsitesRelationRepository {
    /**
     * get User websites relations
     * @return unique website list
     */
    async getStoreWebsitesRelations() {
        // @ts-ignore
        return await database_service_1.collections.storeWebsitesRelationModel.find({ alarm: true }).toArray();
    }
}
exports.default = StoreWebsitesRelationRepository;
