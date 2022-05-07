"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserModel {
    constructor(userId, alarm, cachedAlarm) {
        this.userId = userId;
        this.alarm = alarm;
        this.cachedAlarm = cachedAlarm;
    }
}
exports.default = UserModel;
