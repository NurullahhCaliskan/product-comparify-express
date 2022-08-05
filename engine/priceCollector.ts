import { rateAsPercentage } from '../utility/mathUtility';
import ProductPriceHistoryModel from '../model/productPriceHistoryModel';

export default class PriceCollector {

    getPriceChangeVariantListByProduct(todayProduct: ProductPriceHistoryModel, yesterdayProduct: ProductPriceHistoryModel):   number {

        try {
            let todayProductEntity =todayProduct.variants[0]

            // @ts-ignore
            let yesterdayProductEntity = yesterdayProduct.variants.find(variant => variant.id == todayProductEntity.id);

            if (!yesterdayProductEntity) {
                return 0;
            }

            // @ts-ignore
            return rateAsPercentage(todayProductEntity.price, yesterdayProductEntity.price) as number;

        } catch (e) {
        }
        // @ts-ignore
        return 0;
    }
}
