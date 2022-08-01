"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.divideChunks = exports.arrayIsEmpty = void 0;
const lodash_1 = __importDefault(require("lodash"));
function arrayIsEmpty(list) {
    return !list || list.length === 0;
}
exports.arrayIsEmpty = arrayIsEmpty;
function divideChunks(data, divide) {
    return lodash_1.default.chunk(data, Math.ceil(data.length / divide));
}
exports.divideChunks = divideChunks;
