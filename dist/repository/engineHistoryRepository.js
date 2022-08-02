"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_service_1 = require("../database.service");
class EngineHistoryRepository {
    /***
     * save engine history by model
     * @param engineHistoryModel
     */
    async saveEngineHistory(engineHistoryModel) {
        var _a;
        if (engineHistoryModel.status === 1) {
            await ((_a = database_service_1.collections.engineHistoryModel) === null || _a === void 0 ? void 0 : _a.insertOne(engineHistoryModel));
        }
        else {
            let query = { endDateTime: engineHistoryModel.endDateTime, status: 0 };
            let newRecord = { $set: query };
            await database_service_1.collections.engineHistoryModel.updateOne({ status: 1 }, newRecord);
        }
    }
}
exports.default = EngineHistoryRepository;
