"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mathUtility_1 = require("../utility/mathUtility");
class PriceCollector {
    getPriceChangeVariantListByProduct(todayProduct, yesterdayProduct) {
        try {
            let todayProductEntity = todayProduct.variants[0];
            // @ts-ignore
            let yesterdayProductEntity = yesterdayProduct.variants.find(variant => variant.id == todayProductEntity.id);
            if (!yesterdayProductEntity) {
                return 0;
            }
            // @ts-ignore
            return (0, mathUtility_1.rateAsPercentage)(todayProductEntity.price, yesterdayProductEntity.price);
        }
        catch (e) {
        }
        // @ts-ignore
        return 0;
    }
}
exports.default = PriceCollector;
