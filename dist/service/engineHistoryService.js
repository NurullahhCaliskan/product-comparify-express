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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const engineHistoryRepository_1 = __importDefault(require("../repository/engineHistoryRepository"));
class EngineHistoryService {
    /***
     * save mail history by url
     * @param engineHistoryModel
     */
    saveEngineHistory(engineHistoryModel) {
        return __awaiter(this, void 0, void 0, function* () {
            let engineHistoryRepository = new engineHistoryRepository_1.default();
            yield engineHistoryRepository.saveEngineHistory(engineHistoryModel);
        });
    }
}
exports.default = EngineHistoryService;
