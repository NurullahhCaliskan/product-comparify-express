import _ from 'lodash';
import ProductPriceHistoryWithCompareModel from '../model/productPriceHistoryWithCompareModel';
import ProductPriceHistoryModel from '../model/productPriceHistoryModel';


export function arrayIsEmpty(list: object[]) {
    return !list || list.length === 0;

}

export function divideChunks(data: object[], divide: number): object[][] {
    return _.chunk(data, Math.ceil(data.length / divide));
}

/***
 * divide to model
 * @param compareEntity
 */
export function convertCompareToDayProductPrices(compareEntity: ProductPriceHistoryWithCompareModel): ProductPriceHistoryModel[] {
    let today: ProductPriceHistoryModel = { id: compareEntity.today_id, timestamp_id: compareEntity.today_timestamp_id, website: compareEntity.today_website, created_date_time: compareEntity.today_created_date_time, currency: compareEntity.today_currency, variants: [compareEntity.today_variant] };
    let yesterday: ProductPriceHistoryModel = { id: compareEntity.yesterday_id, timestamp_id: compareEntity.yesterday_timestamp_id, website: compareEntity.yesterday_website, created_date_time: compareEntity.yesterday_created_date_time, currency: compareEntity.yesterday_currency, variants: [compareEntity.yesterday_variant] };

    return [today, yesterday];
}
