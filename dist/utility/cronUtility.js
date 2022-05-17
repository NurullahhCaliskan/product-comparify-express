"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVERY_20_SECOND = exports.EVERY_TEN_SECOND = exports.EVERY_SECOND = exports.EVERY_DAY_AT_MIDNIGHT = void 0;
function EVERY_DAY_AT_MIDNIGHT() {
    return '0 0 * * *';
}
exports.EVERY_DAY_AT_MIDNIGHT = EVERY_DAY_AT_MIDNIGHT;
function EVERY_SECOND() {
    return '*/1 * * * * *';
}
exports.EVERY_SECOND = EVERY_SECOND;
function EVERY_TEN_SECOND() {
    return '*/10 * * * * *';
}
exports.EVERY_TEN_SECOND = EVERY_TEN_SECOND;
function EVERY_20_SECOND() {
    return '*/20 * * * * *';
}
exports.EVERY_20_SECOND = EVERY_20_SECOND;
