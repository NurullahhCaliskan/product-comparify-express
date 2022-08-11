"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mathUtility_1 = require("../utility/mathUtility");
class PriceCollector {
    getPriceChangeVariantListByProduct(todayPrice, yesterdayPrice) {
        try {
            // @ts-ignore
            return (0, mathUtility_1.rateAsPercentage)(todayPrice, yesterdayPrice);
        }
        catch (e) {
        }
        // @ts-ignore
        return 0;
    }
}
exports.default = PriceCollector;
