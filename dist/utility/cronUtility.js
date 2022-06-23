"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_QUEUE_SCHEDULED_AS_SECOND = exports.EVERY_20_SECOND = exports.EVERY_TEN_SECOND = exports.EVERY_SECOND = exports.EVERY_DAY_AT_MIDNIGHT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: `.env.${process.env.NODE_ENV}` });
function EVERY_DAY_AT_MIDNIGHT() {
    return '0 0 * * *';
}
exports.EVERY_DAY_AT_MIDNIGHT = EVERY_DAY_AT_MIDNIGHT;
function EVERY_SECOND() {
    return '*/1 * * * * *';
}
exports.EVERY_SECOND = EVERY_SECOND;
function EVERY_TEN_SECOND() {
    console.log();
    return '*/10 * * * * *';
}
exports.EVERY_TEN_SECOND = EVERY_TEN_SECOND;
function EVERY_20_SECOND() {
    return '*/20 * * * * *';
}
exports.EVERY_20_SECOND = EVERY_20_SECOND;
function GET_QUEUE_SCHEDULED_AS_SECOND() {
    let response = '*/:second * * * * *';
    // @ts-ignore
    response = response.replace(":second", process.env.QUEUE_ENGINE_SCHEDULED_AS_SECOND);
    return response;
}
exports.GET_QUEUE_SCHEDULED_AS_SECOND = GET_QUEUE_SCHEDULED_AS_SECOND;
