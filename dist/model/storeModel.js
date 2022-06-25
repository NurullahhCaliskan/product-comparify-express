"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StoreModel {
    constructor(id, selectedMail, alarm, cachedAlarm, _id) {
        this.id = id;
        this.selectedMail = selectedMail;
        this.alarm = alarm;
        this.cachedAlarm = cachedAlarm;
        this._id = _id;
    }
}
exports.default = StoreModel;
