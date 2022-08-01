"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_service_1 = require("../database.service");
class PropertiesRepository {
    async getPropertiesByText(text) {
        var _a;
        // @ts-ignore
        return await ((_a = database_service_1.collections.properties) === null || _a === void 0 ? void 0 : _a.findOne({ text: text }));
    }
}
exports.default = PropertiesRepository;
