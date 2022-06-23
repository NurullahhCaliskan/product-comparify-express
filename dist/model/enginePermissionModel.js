"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EnginePermissionModel {
    constructor(collection, status, last_run_time, info, _id) {
        this.collection = collection;
        this.status = status;
        this.last_run_time = last_run_time;
        this.info = info;
        this._id = _id;
    }
}
exports.default = EnginePermissionModel;
