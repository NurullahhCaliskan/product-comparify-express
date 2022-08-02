"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EngineHistoryModel {
    constructor(createDateTime, endDateTime, status, _id) {
        this.createDateTime = createDateTime;
        this.endDateTime = endDateTime;
        this.status = status;
        this._id = _id;
    }
}
exports.default = EngineHistoryModel;
