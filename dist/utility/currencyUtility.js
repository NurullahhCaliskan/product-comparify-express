"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currencyStringToCurrenctSymbol = void 0;
function currencyStringToCurrenctSymbol(value) {
    let currencySymbols = {
        'USD': '$',
        'EUR': '€',
        'CRC': '₡',
        'GBP': '£',
        'ILS': '₪',
        'INR': '₹',
        'JPY': '¥',
        'KRW': '₩',
        'NGN': '₦',
        'PHP': '₱',
        'PLN': 'zł',
        'PYG': '₲',
        'THB': '฿',
        'UAH': '₴',
        'VND': '₫', // Vietnamese Dong
    };
    // @ts-ignore
    if (!currencySymbols[value]) {
        return "";
    }
    // @ts-ignore
    return currencySymbols[value];
}
exports.currencyStringToCurrenctSymbol = currencyStringToCurrenctSymbol;
