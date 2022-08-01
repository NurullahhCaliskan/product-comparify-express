"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_service_1 = require("../database.service");
const dayUtility_1 = require("../utility/dayUtility");
class EnginePermissionRepository {
    /**
     * available check
     */
    async isAvailableRunQueueEngine() {
        var _a;
        let yesterdayMidnight = (0, dayUtility_1.getYesterdayMidnight)();
        let findJson = { $and: [{ collection: 'product-history-crawler-queue' }, { status: 1 }, { last_run_time: { $gte: yesterdayMidnight } }] };
        let response = await ((_a = database_service_1.collections.enginePermissionModel) === null || _a === void 0 ? void 0 : _a.find(findJson).toArray());
        return response.length <= 0;
    }
    /***
     * set available check
     */
    async setAvailableQueueEngine() {
        let query = { collection: 'product-history-crawler-queue' };
        let newRecord = { $set: { status: 0, last_run_time: new Date() } };
        // @ts-ignore
        await database_service_1.collections.enginePermissionModel.updateOne(query, newRecord);
    }
    async setUnavailableQueueEngine() {
        let query = { collection: 'product-history-crawler-queue' };
        let newRecord = { $set: { status: 1, last_run_time: new Date() } };
        // @ts-ignore
        await database_service_1.collections.enginePermissionModel.updateOne(query, newRecord);
    }
    /***
     * set unavailable check
     */
    async isAvailableRunMainEngine() {
        var _a;
        let findJson = { $and: [{ collection: 'product-history-main' }, { status: 1 }] };
        let response = await ((_a = database_service_1.collections.enginePermissionModel) === null || _a === void 0 ? void 0 : _a.find(findJson).toArray());
        return response.length <= 0;
    }
    async setAvailableMainEngine() {
        let query = { collection: 'product-history-main' };
        let newRecord = { $set: { status: 0, last_run_time: new Date() } };
        // @ts-ignore
        await database_service_1.collections.enginePermissionModel.updateOne(query, newRecord);
    }
    async setUnavailableMainEngine() {
        let query = { collection: 'product-history-main' };
        let newRecord = { $set: { status: 1, last_run_time: new Date() } };
        // @ts-ignore
        await database_service_1.collections.enginePermissionModel.updateOne(query, newRecord);
    }
}
exports.default = EnginePermissionRepository;
