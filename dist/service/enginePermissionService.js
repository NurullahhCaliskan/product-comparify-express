"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const enginePermissionRepository_1 = __importDefault(require("../repository/enginePermissionRepository"));
class EnginePermissionService {
    /**
     * available check
     */
    isAvailableRunQueueEngine() {
        return __awaiter(this, void 0, void 0, function* () {
            let enginePermissionRepository = new enginePermissionRepository_1.default();
            return yield enginePermissionRepository.isAvailableRunQueueEngine();
        });
    }
    /***
     * set available check
     */
    setAvailableQueueEngine() {
        return __awaiter(this, void 0, void 0, function* () {
            let enginePermissionRepository = new enginePermissionRepository_1.default();
            yield enginePermissionRepository.setAvailableQueueEngine();
        });
    }
    /***
     * set unavailable check
     */
    setUnavailableQueueEngine() {
        return __awaiter(this, void 0, void 0, function* () {
            let enginePermissionRepository = new enginePermissionRepository_1.default();
            yield enginePermissionRepository.setUnavailableQueueEngine();
        });
    }
    /***
     * save mail history by url
     * @param mailHistoryModel
     */
    isAvailableRunMainEngine() {
        return __awaiter(this, void 0, void 0, function* () {
            let enginePermissionRepository = new enginePermissionRepository_1.default();
            return yield enginePermissionRepository.isAvailableRunMainEngine();
        });
    }
    setAvailableMainEngine() {
        return __awaiter(this, void 0, void 0, function* () {
            let enginePermissionRepository = new enginePermissionRepository_1.default();
            yield enginePermissionRepository.setAvailableMainEngine();
        });
    }
    setUnavailableMainEngine() {
        return __awaiter(this, void 0, void 0, function* () {
            let enginePermissionRepository = new enginePermissionRepository_1.default();
            yield enginePermissionRepository.setUnavailableMainEngine();
        });
    }
}
exports.default = EnginePermissionService;
