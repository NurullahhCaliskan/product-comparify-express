import ProductHistoryService from '../service/productHistoryService';
import WebsiteModel from '../model/websiteModel';

export default async function scrap(websites : WebsiteModel[]) {
    let productHistoryService = new ProductHistoryService();

    for (const website of websites) {
        //await productHistoryService.saveProductsFromWebByUrl(website);
    }
}






