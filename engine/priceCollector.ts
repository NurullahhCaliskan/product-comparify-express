import { rateAsPercentage } from '../utility/mathUtility';
import ProductPriceHistoryModel from '../model/productPriceHistoryModel';

export default class PriceCollector {

    getPriceChangeVariantListByProduct(todayPrice: number, yesterdayPrice: number):   number {

        try {

            // @ts-ignore
            return rateAsPercentage(todayPrice, yesterdayPrice) as number;

        } catch (e) {
        }
        // @ts-ignore
        return 0;
    }
}
