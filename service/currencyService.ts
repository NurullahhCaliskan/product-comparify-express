import CurrencyRepository from '../repository/currencyRepository';
import setCurrencyList from '../static/currenciesList';

export default class CurrencyService {
    /***
     * save mail history by url
     */
    async saveCurrenciesByApi() {
        let currencyRepository = new CurrencyRepository();
        await currencyRepository.saveCurrenciesByApi();
    }

    async refreshCurrencyList(){
        let currencyRepository = new CurrencyRepository();
        let response = await currencyRepository.getAllCurrencies();

        // @ts-ignore
        setCurrencyList(response)

    }
}
