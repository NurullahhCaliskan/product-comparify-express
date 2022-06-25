"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MailHistoryModel {
    constructor(storeId, createDateTime, mailBody, status, result, cachedAlarm, _id) {
        this.storeId = storeId;
        this.createDateTime = createDateTime;
        this.mailBody = mailBody;
        this.status = status;
        this.result = result;
        this.cachedAlarm = cachedAlarm;
        this._id = _id;
    }
}
exports.default = MailHistoryModel;
