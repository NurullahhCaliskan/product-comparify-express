import ProductHistoryModel from "../model/productHistoryModel";
import {rateAsPercentage} from "../utility/mathUtility";

export default class PriceCollector {

    getPriceChangeVariantListByProduct(todayProduct: ProductHistoryModel, yesterdayProduct: ProductHistoryModel): [{ productId: number, priceRate: number }] {

        let response = []


        for (const todayProductEntity of todayProduct.variants) {
            // @ts-ignore
            let id = todayProductEntity.id as number

            // @ts-ignore
            let yesterdayProductEntity = yesterdayProduct.variants.find(variant => variant.id == id)

            //if yesterday is not exists, this product added new
            if (!yesterdayProductEntity) {
                continue;
            }

            console.log(todayProductEntity)
            console.log(yesterdayProductEntity)
            // @ts-ignore
            let priceRate = rateAsPercentage(todayProductEntity.price, yesterdayProductEntity.price) as number

            response.push({productId: id, priceRate: priceRate})
        }

        // @ts-ignore
        return response;
    }
}
