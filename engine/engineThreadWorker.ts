import ProductHistoryService from '../service/productHistoryService';
import WebsiteModel from '../model/websiteModel';
import CurrencyService from '../service/currencyService';

export default async function scrap(websites : WebsiteModel[]) {
    let productHistoryService = new ProductHistoryService();
    let currencyService = new CurrencyService();

    await currencyService.refreshCurrencyList();
    for (const website of websites) {
        await productHistoryService.saveProductsFromWebByUrl(website);
    }
}






