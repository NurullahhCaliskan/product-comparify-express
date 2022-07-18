"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrencyRateByCurrency = exports.getCurrencyRateCorrespondUsd = void 0;
const currenciesList_1 = require("../static/currenciesList");
function getCurrencyRateCorrespondUsd(data) {
    let currency = 'USD';
    try {
        if (data) {
            currency = data.cart.currency;
        }
    }
    catch (e) {
    }
    return getCurrencyRateByCurrency(currency);
}
exports.getCurrencyRateCorrespondUsd = getCurrencyRateCorrespondUsd;
function getCurrencyRateByCurrency(currency) {
    try {
        return currenciesList_1.currencyList.filter(currencyEntity => currencyEntity.key === currency)[0].value;
    }
    catch (e) {
        return 1;
    }
}
exports.getCurrencyRateByCurrency = getCurrencyRateByCurrency;
