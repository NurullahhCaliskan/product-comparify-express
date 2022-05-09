"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mathUtility_1 = require("../utility/mathUtility");
class PriceCollector {
    getPriceChangeVariantListByProduct(todayProduct, yesterdayProduct) {
        let response = [];
        for (const todayProductEntity of todayProduct.variants) {
            // @ts-ignore
            let id = todayProductEntity.id;
            // @ts-ignore
            let yesterdayProductEntity = yesterdayProduct.variants.find(variant => variant.id == id);
            //if yesterday is not exists, this product added new
            if (!yesterdayProductEntity) {
                continue;
            }
            // @ts-ignore
            let priceRate = (0, mathUtility_1.rateAsPercentage)(todayProductEntity.price, yesterdayProductEntity.price);
            response.push({ productId: id, priceRate: priceRate });
        }
        // @ts-ignore
        return response;
    }
}
exports.default = PriceCollector;
