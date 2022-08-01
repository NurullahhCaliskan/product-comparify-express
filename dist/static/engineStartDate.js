"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEngineEndDate = exports.setEngineStartDate = exports.endDate = exports.startDate = void 0;
exports.startDate = new Date();
exports.endDate = new Date();
function setEngineStartDate() {
    exports.startDate = new Date();
}
exports.setEngineStartDate = setEngineStartDate;
function setEngineEndDate() {
    exports.endDate = new Date();
}
exports.setEngineEndDate = setEngineEndDate;
