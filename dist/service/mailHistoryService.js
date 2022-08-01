"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mailHistoryRepository_1 = __importDefault(require("../repository/mailHistoryRepository"));
class MailHistoryService {
    /***
     * save mail history by url
     * @param mailHistoryModel
     */
    async saveMailHistory(mailHistoryModel) {
        let mailHistoryRepository = new mailHistoryRepository_1.default();
        await mailHistoryRepository.saveMailHistory(mailHistoryModel);
    }
}
exports.default = MailHistoryService;
