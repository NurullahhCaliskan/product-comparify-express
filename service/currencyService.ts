import CurrencyRepository from '../repository/currencyRepository';
import setCurrencyList from '../static/currenciesList';

export default class CurrencyService {

    /**
     * Save Currencies with Use API
     * NOTE: This endpoint working every night 1 time
     */
    async saveCurrenciesByApi() {
        let currencyRepository = new CurrencyRepository();
        await currencyRepository.saveCurrenciesByApi();
    }

    /**
     * Refresh Currencies with Use API
     * NOTE: This endpoint working every night 1 time
     */
    async refreshCurrencyList(){
        let currencyRepository = new CurrencyRepository();
        let response = await currencyRepository.getAllCurrencies();

        // @ts-ignore
        setCurrencyList(response)

    }
}
