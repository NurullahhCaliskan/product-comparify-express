import WebsiteModel from '../model/websiteModel';
import { currencyList } from '../static/currenciesList';

export function getCurrencyRateCorrespondUsd(data: WebsiteModel | null): number {
    let currency = 'USD';
    try {
        if (data) {
            currency = data.cart.currency;
        }
    } catch (e) {

    }

    return getCurrencyRateByCurrency(currency);

}

export function getCurrencyRateByCurrency(currency: string): number {
    try {

        return currencyList.filter(currencyEntity => currencyEntity.key === currency)[0].value;
    } catch (e) {
        return 1;
    }
}
