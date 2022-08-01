import { rateAsPercentage } from '../utility/mathUtility';
import ProductPriceHistoryModel from '../model/productPriceHistoryModel';

export default class PriceCollector {

    getPriceChangeVariantListByProduct(todayProduct: ProductPriceHistoryModel, yesterdayProduct: ProductPriceHistoryModel): [{ productId: number, priceRate: number }] {

        let response = [];

        try {
            for (const todayProductEntity of todayProduct.variants) {
                // @ts-ignore
                let id = todayProductEntity.id as number;

                // @ts-ignore
                let yesterdayProductEntity = yesterdayProduct.variants.find(variant => variant.id == id);

                //if yesterday is not exists, this product added new
                if (!yesterdayProductEntity) {
                    console.log('yesterdayProductEntity');
                    continue;
                }

                // @ts-ignore
                let priceRate = rateAsPercentage(todayProductEntity.price, yesterdayProductEntity.price) as number;

                response.push({ productId: id, priceRate: priceRate });
            }

        } catch (e) {
        }
        // @ts-ignore
        return response;
    }
}
