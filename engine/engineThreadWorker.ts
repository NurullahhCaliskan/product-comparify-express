import ProductHistoryService from '../service/productHistoryService';
import WebsiteModel from '../model/websiteModel';
import CurrencyService from '../service/currencyService';
import { expose } from 'threads/worker';
import { logger } from '../utility/logUtility';

expose(async function scrap(websites: WebsiteModel[]) {
    let productHistoryService = new ProductHistoryService();
    let currencyService = new CurrencyService();

    await currencyService.refreshCurrencyList();
    for (const website of websites) {
        await productHistoryService.saveProductsFromWebByUrl(website);
    }
});






