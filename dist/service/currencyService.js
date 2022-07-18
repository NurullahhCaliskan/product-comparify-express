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
const currencyRepository_1 = __importDefault(require("../repository/currencyRepository"));
const currenciesList_1 = __importDefault(require("../static/currenciesList"));
class CurrencyService {
    /**
     * Save Currencies with Use API
     * NOTE: This endpoint working every night 1 time
     */
    saveCurrenciesByApi() {
        return __awaiter(this, void 0, void 0, function* () {
            let currencyRepository = new currencyRepository_1.default();
            yield currencyRepository.saveCurrenciesByApi();
        });
    }
    /**
     * Refresh Currencies with Use API
     * NOTE: This endpoint working every night 1 time
     */
    refreshCurrencyList() {
        return __awaiter(this, void 0, void 0, function* () {
            let currencyRepository = new currencyRepository_1.default();
            let response = yield currencyRepository.getAllCurrencies();
            // @ts-ignore
            (0, currenciesList_1.default)(response);
        });
    }
}
exports.default = CurrencyService;
