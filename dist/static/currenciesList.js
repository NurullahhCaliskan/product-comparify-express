"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.currencyList = void 0;
const database_service_1 = require("../database.service");
// @ts-ignore
exports.currencyList = (_a = database_service_1.collections.currency) === null || _a === void 0 ? void 0 : _a.find().toArray();
