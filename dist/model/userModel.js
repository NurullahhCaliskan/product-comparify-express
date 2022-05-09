"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserModel {
    constructor(userId, mail, alarm, cachedAlarm, id) {
        this.userId = userId;
        this.mail = mail;
        this.alarm = alarm;
        this.cachedAlarm = cachedAlarm;
        this.id = id;
    }
}
exports.default = UserModel;
