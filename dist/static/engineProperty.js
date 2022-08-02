"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEngineEndDate = exports.setEngineStartDate = exports.endDate = exports.startDate = void 0;
exports.startDate = new Date(Date.now() - 86400000);
exports.endDate = new Date(Date.now() - 86400000);
/***
 * set Start date to engine
 */
function setEngineStartDate() {
    exports.startDate = new Date();
}
exports.setEngineStartDate = setEngineStartDate;
/***
 * set End date to engine
 */
function setEngineEndDate() {
    exports.endDate = new Date();
}
exports.setEngineEndDate = setEngineEndDate;
