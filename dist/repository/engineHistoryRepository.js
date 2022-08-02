"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_service_1 = require("../database.service");
const propertiesService_1 = __importDefault(require("../service/propertiesService"));
class EngineHistoryRepository {
    /***
     * save engine history by model
     * @param engineHistoryModel
     */
    async saveEngineHistory(engineHistoryModel) {
        var _a;
        let propertiesService = new propertiesService_1.default();
        let chunkedProperties = await propertiesService.getPropertiesByText('scrap-chunk-count');
        if (engineHistoryModel.status === 1) {
            await ((_a = database_service_1.collections.engineHistoryModel) === null || _a === void 0 ? void 0 : _a.insertOne(engineHistoryModel));
        }
        else {
            let query = { endDateTime: engineHistoryModel.endDateTime, status: 0, threadCount: chunkedProperties.value };
            let newRecord = { $set: query };
            await database_service_1.collections.engineHistoryModel.updateOne({ status: 1 }, newRecord);
        }
    }
}
exports.default = EngineHistoryRepository;
