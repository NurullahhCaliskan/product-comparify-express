"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTodayMidnight = exports.getYesterdayMidnight = void 0;
function getYesterdayMidnight() {
    let date = new Date();
    date.setDate(date.getDate() - 1);
    date.setHours(0, 0, 0, 0);
    return date;
}
exports.getYesterdayMidnight = getYesterdayMidnight;
function getTodayMidnight() {
    let date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
}
exports.getTodayMidnight = getTodayMidnight;
