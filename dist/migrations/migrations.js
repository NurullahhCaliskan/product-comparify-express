"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIndex = void 0;
const database_service_1 = require("../database.service");
async function createIndex() {
    var _a, _b;
    await ((_a = database_service_1.collections.productPriceHistoryTodayModel) === null || _a === void 0 ? void 0 : _a.createIndex({ 'id': 1, 'website': 1 }));
    await ((_b = database_service_1.collections.productPriceHistoryYesterdayModel) === null || _b === void 0 ? void 0 : _b.createIndex({ 'id': 1, 'website': 1 }));
}
exports.createIndex = createIndex;
