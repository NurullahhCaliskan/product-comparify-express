"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const enginePermissionRepository_1 = __importDefault(require("../repository/enginePermissionRepository"));
class EnginePermissionService {
    /**
     * available check
     */
    async isAvailableRunQueueEngine() {
        let enginePermissionRepository = new enginePermissionRepository_1.default();
        return await enginePermissionRepository.isAvailableRunQueueEngine();
    }
    /***
     * set available check
     */
    async setAvailableQueueEngine() {
        let enginePermissionRepository = new enginePermissionRepository_1.default();
        await enginePermissionRepository.setAvailableQueueEngine();
    }
    /***
     * set unavailable check
     */
    async setUnavailableQueueEngine() {
        let enginePermissionRepository = new enginePermissionRepository_1.default();
        await enginePermissionRepository.setUnavailableQueueEngine();
    }
    /***
     * save mail history by url
     * @param mailHistoryModel
     */
    async isAvailableRunMainEngine() {
        let enginePermissionRepository = new enginePermissionRepository_1.default();
        return await enginePermissionRepository.isAvailableRunMainEngine();
    }
    async setAvailableMainEngine() {
        let enginePermissionRepository = new enginePermissionRepository_1.default();
        await enginePermissionRepository.setAvailableMainEngine();
    }
    async setUnavailableMainEngine() {
        let enginePermissionRepository = new enginePermissionRepository_1.default();
        await enginePermissionRepository.setUnavailableMainEngine();
    }
}
exports.default = EnginePermissionService;
