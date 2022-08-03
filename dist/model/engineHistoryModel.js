"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EngineHistoryModel {
    constructor(createDateTime, firstDateTime, endDateTime, status, threadCount, _id) {
        this.createDateTime = createDateTime;
        this.firstDateTime = firstDateTime;
        this.endDateTime = endDateTime;
        this.status = status;
        this.threadCount = threadCount;
        this._id = _id;
    }
}
exports.default = EngineHistoryModel;
