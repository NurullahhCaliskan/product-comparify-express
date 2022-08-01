"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_service_1 = require("../database.service");
class MailHistoryRepository {
    /***
     * save mail history by url
     * @param mailHistoryModel
     */
    async saveMailHistory(mailHistoryModel) {
        var _a;
        await ((_a = database_service_1.collections.mailHistoryModel) === null || _a === void 0 ? void 0 : _a.insertOne(mailHistoryModel));
    }
}
exports.default = MailHistoryRepository;
