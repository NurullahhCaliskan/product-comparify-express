"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_service_1 = require("../database.service");
const axios_1 = __importDefault(require("axios"));
const logUtility_1 = require("../utility/logUtility");
class CurrencyRepository {
    async saveCurrenciesByApi() {
        var _a, _b;
        try {
            logUtility_1.logger.info(__filename + 'saveCurrenciesByApi');
            let curArray = [];
            let requestOptions = {
                method: 'GET',
                redirect: 'follow',
                headers: { 'apikey': process.env.APILAYER_API_KEY },
            };
            let response;
            // @ts-ignore
            response = await axios_1.default.get('https://api.apilayer.com/exchangerates_data/latest?base=usd', requestOptions);
            let data = response.data.rates;
            Object.entries(data).forEach(entry => {
                const [key, value] = entry;
                curArray.push({ key: key, value: value });
            });
            await ((_a = database_service_1.collections.currency) === null || _a === void 0 ? void 0 : _a.deleteMany({}));
            await ((_b = database_service_1.collections.currency) === null || _b === void 0 ? void 0 : _b.insertMany(curArray));
            logUtility_1.logger.info(__filename + 'successCur');
        }
        catch (e) {
            logUtility_1.logger.error(__filename + 'fail cur' + e);
        }
    }
    async getAllCurrencies() {
        var _a;
        return await ((_a = database_service_1.collections.currency) === null || _a === void 0 ? void 0 : _a.find().toArray());
    }
}
exports.default = CurrencyRepository;
