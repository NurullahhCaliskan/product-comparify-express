"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYesterdayAsNumber = exports.getTodayAsNumber = exports.formatDate = exports.getTomorrowMidnight = exports.getTodayMidnight = exports.getYesterdayMidnight = void 0;
const moment_1 = __importDefault(require("moment"));
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
function formatDate() {
    let d = new Date();
    return [d.getFullYear(), d.getMonth(), d.getDay()].join('-');
}
exports.formatDate = formatDate;
function getTodayAsNumber() {
    return parseInt((0, moment_1.default)().subtract(process.env.CRAWL_MINUS_TODAY, 'days').format('YYYYMMDD'));
}
exports.getTodayAsNumber = getTodayAsNumber;
function getYesterdayAsNumber() {
    // @ts-ignore
    return parseInt((0, moment_1.default)().subtract(process.env.CRAWL_MINUS_TODAY + 1, 'days').format('YYYYMMDD'));
}
exports.getYesterdayAsNumber = getYesterdayAsNumber;
