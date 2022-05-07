"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rate = exports.rateAsPercentage = void 0;
function rateAsPercentage(partialValue, totalValue) {
    let result = 0;
    try {
        result = ((100 * partialValue) / totalValue) - 100;
    }
    catch (e) {
    }
    return result;
}
exports.rateAsPercentage = rateAsPercentage;
function rate(partialValue, totalValue) {
    let result = 0;
    try {
        result = (partialValue) / totalValue;
    }
    catch (e) {
    }
    return result;
}
exports.rate = rate;
