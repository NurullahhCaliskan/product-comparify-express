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
Object.defineProperty(exports, "__esModule", { value: true });
const database_service_1 = require("../database.service");
const dayUtility_1 = require("../utility/dayUtility");
class EnginePermissionRepository {
    /***
     * save mail history by url
     * @param mailHistoryModel
     */
    isAvailableRunQueueEngine() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let yesterdayMidnight = (0, dayUtility_1.getYesterdayMidnight)();
            let findJson = { $and: [{ collection: "product-history-crawler-queue" }, { status: 1 }, { last_run_time: { $gte: yesterdayMidnight } }] };
            let response = yield ((_a = database_service_1.collections.enginePermissionModel) === null || _a === void 0 ? void 0 : _a.find(findJson).toArray());
            return response.length <= 0;
        });
    }
    setAvailableQueueEngine() {
        return __awaiter(this, void 0, void 0, function* () {
            let query = { collection: "product-history-crawler-queue" };
            let newRecord = { $set: { status: 0, last_run_time: new Date() } };
            // @ts-ignore
            yield database_service_1.collections.enginePermissionModel.updateOne(query, newRecord);
        });
    }
    setUnavailableQueueEngine() {
        return __awaiter(this, void 0, void 0, function* () {
            let query = { collection: "product-history-crawler-queue" };
            let newRecord = { $set: { status: 1, last_run_time: new Date() } };
            // @ts-ignore
            yield database_service_1.collections.enginePermissionModel.updateOne(query, newRecord);
        });
    }
}
exports.default = EnginePermissionRepository;
