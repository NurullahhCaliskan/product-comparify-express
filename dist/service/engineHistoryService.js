"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const engineHistoryRepository_1 = __importDefault(require("../repository/engineHistoryRepository"));
class EngineHistoryService {
    /***
     * save engine history
     * @param engineHistoryModel
     */
    async saveEngineHistory(engineHistoryModel) {
        let engineHistoryRepository = new engineHistoryRepository_1.default();
        await engineHistoryRepository.saveEngineHistory(engineHistoryModel);
    }
}
exports.default = EngineHistoryService;
