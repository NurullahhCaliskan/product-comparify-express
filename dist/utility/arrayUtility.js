"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertCompareToDayProductPrices = exports.divideChunks = exports.arrayIsEmpty = void 0;
const lodash_1 = __importDefault(require("lodash"));
function arrayIsEmpty(list) {
    return !list || list.length === 0;
}
exports.arrayIsEmpty = arrayIsEmpty;
function divideChunks(data, divide) {
    return lodash_1.default.chunk(data, Math.ceil(data.length / divide));
}
exports.divideChunks = divideChunks;
/***
 * divide to model
 * @param compareEntity
 */
function convertCompareToDayProductPrices(compareEntity) {
    let today = { id: compareEntity.today_id, timestamp_id: compareEntity.today_timestamp_id, website: compareEntity.today_website, created_date_time: compareEntity.today_created_date_time, currency: compareEntity.today_currency, variants: [compareEntity.today_variant] };
    let yesterday = { id: compareEntity.yesterday_id, timestamp_id: compareEntity.yesterday_timestamp_id, website: compareEntity.yesterday_website, created_date_time: compareEntity.yesterday_created_date_time, currency: compareEntity.yesterday_currency, variants: [compareEntity.yesterday_variant] };
    return [today, yesterday];
}
exports.convertCompareToDayProductPrices = convertCompareToDayProductPrices;
