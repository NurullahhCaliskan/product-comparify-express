"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_service_1 = require("../database.service");
class EngineHistoryRepository {
    /***
     * save engine history by model
     * 0 is set finish, 1 is set start, 2 is set half start
     * @param engineHistoryModel
     */
    async saveEngineHistory(engineHistoryModel) {
        var _a;
        if (engineHistoryModel.status === 1) {
            await ((_a = database_service_1.collections.engineHistoryModel) === null || _a === void 0 ? void 0 : _a.insertOne(engineHistoryModel));
        }
        else if (engineHistoryModel.status === 2) {
            let query = { endDateTime: engineHistoryModel.endDateTime, status: 2 };
            let newRecord = { $set: query };
            await database_service_1.collections.engineHistoryModel.updateOne({ status: 1 }, newRecord);
        }
        else {
            let query = { endDateTime: engineHistoryModel.endDateTime, status: 0 };
            let newRecord = { $set: query };
            await database_service_1.collections.engineHistoryModel.updateOne({ status: 2 }, newRecord);
        }
    }
}
exports.default = EngineHistoryRepository;
