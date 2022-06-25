"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mathUtility_1 = require("../utility/mathUtility");
class PriceCollector {
    getPriceChangeVariantListByProduct(todayProduct, yesterdayProduct) {
        let response = [];
        try {
            for (const todayProductEntity of todayProduct.variants) {
                // @ts-ignore
                let id = todayProductEntity.id;
                // @ts-ignore
                let yesterdayProductEntity = yesterdayProduct.variants.find(variant => variant.id == id);
                //if yesterday is not exists, this product added new
                if (!yesterdayProductEntity) {
                    console.log("yesterdayProductEntity");
                    continue;
                }
                // @ts-ignore
                let priceRate = (0, mathUtility_1.rateAsPercentage)(todayProductEntity.price, yesterdayProductEntity.price);
                response.push({ productId: id, priceRate: priceRate });
            }
        }
        catch (e) {
            console.log("Error occured1");
            console.log(todayProduct);
            console.log(yesterdayProduct);
        }
        // @ts-ignore
        return response;
    }
}
exports.default = PriceCollector;
