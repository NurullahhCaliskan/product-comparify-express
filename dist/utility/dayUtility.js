"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTomorrowMidnight = exports.getTodayMidnight = exports.getYesterdayMidnight = void 0;
function getYesterdayMidnight() {
    let date = new Date();
    date.setDate(date.getDate() - 1);
    date.setUTCHours(0, 0, 0, 0);
    return date;
}
exports.getYesterdayMidnight = getYesterdayMidnight;
function getTodayMidnight() {
    let date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    return date;
}
exports.getTodayMidnight = getTodayMidnight;
function getTomorrowMidnight() {
    let date = new Date();
    date.setDate(date.getDate() + 1);
    date.setUTCHours(0, 0, 0, 0);
    return date;
}
exports.getTomorrowMidnight = getTomorrowMidnight;
