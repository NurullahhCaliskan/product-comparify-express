"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const currencyRepository_1 = __importDefault(require("../repository/currencyRepository"));
class CurrencyService {
    /**
     * Save Currencies with Use API
     * NOTE: This endpoint working every night 1 time
     */
    async saveCurrenciesByApi() {
        let currencyRepository = new currencyRepository_1.default();
        await currencyRepository.saveCurrenciesByApi();
    }
    /**
     * Refresh Currencies with Use API
     * NOTE: This endpoint working every night 1 time
     */
    async refreshCurrencyList() {
        let currencyRepository = new currencyRepository_1.default();
        let response = await currencyRepository.getAllCurrencies();
        // @ts-ignore
        setCurrencyList(response);
    }
}
exports.default = CurrencyService;
