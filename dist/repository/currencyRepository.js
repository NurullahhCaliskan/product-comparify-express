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
const database_service_1 = require("../database.service");
const axios_1 = __importDefault(require("axios"));
class CurrencyRepository {
    saveCurrenciesByApi() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('saveCurrenciesByApi');
                let curArray = [];
                let requestOptions = {
                    method: 'GET',
                    redirect: 'follow',
                    headers: { 'apikey': process.env.APILAYER_API_KEY },
                };
                let response;
                // @ts-ignore
                response = yield axios_1.default.get('https://api.apilayer.com/exchangerates_data/latest?base=usd', requestOptions);
                let data = response.data.rates;
                Object.entries(data).forEach(entry => {
                    const [key, value] = entry;
                    curArray.push({ key: key, value: value });
                });
                yield ((_a = database_service_1.collections.currency) === null || _a === void 0 ? void 0 : _a.deleteMany({}));
                yield ((_b = database_service_1.collections.currency) === null || _b === void 0 ? void 0 : _b.insertMany(curArray));
                console.log('successCur');
            }
            catch (e) {
                console.log(e);
                console.log('failCur');
            }
        });
    }
    getAllCurrencies() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return yield ((_a = database_service_1.collections.currency) === null || _a === void 0 ? void 0 : _a.find().toArray());
        });
    }
}
exports.default = CurrencyRepository;
