"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const propertiesRepository_1 = __importDefault(require("../repository/propertiesRepository"));
class PropertiesService {
    async getPropertiesByText(text) {
        let propertiesRepository = new propertiesRepository_1.default();
        return await propertiesRepository.getPropertiesByText(text);
    }
}
exports.default = PropertiesService;
