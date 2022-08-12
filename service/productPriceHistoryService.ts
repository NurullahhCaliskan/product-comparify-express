import ProductPriceHistoryRepository from '../repository/productPriceHistoryRepository';
import ProductPriceHistoryModel from '../model/productPriceHistoryModel';
import ProductPriceHistoryWithCompareModel from '../model/productPriceHistoryWithCompareModel';

export default class ProductPriceHistoryService {

    /***local
     * get Product History data
     * @param website website
     */
    async getProductHistoryByDaysAndWebsiteYesterday(website: string): Promise<ProductPriceHistoryModel[]> {
        let productHistoryRepository = new ProductPriceHistoryRepository();

        return await productHistoryRepository.getProductHistoryByDaysAndWebsiteYesterday(website);
    }

    /***
     * get Product History data
     * @param website website
     */
    async getProductHistoryByDaysAndWebsiteToday(website: string): Promise<ProductPriceHistoryModel[]> {
        let productHistoryRepository = new ProductPriceHistoryRepository();

        return await productHistoryRepository.getProductHistoryByDaysAndWebsiteToday(website);
    }

    /***
     * get Product History data
     * @param website website
     */
    async getProductHistoryWithCompare(website: string): Promise<ProductPriceHistoryWithCompareModel[]> {
        let productHistoryRepository = new ProductPriceHistoryRepository();

        return await productHistoryRepository.getProductHistoryWithCompare(website);
    }

    async syncPricesHistoryBeforeStartEngine(){
        let productHistoryRepository = new ProductPriceHistoryRepository();
        return await productHistoryRepository.syncPricesHistoryBeforeStartEngine();
    }

    async saveProductPriceHistory(website: ProductPriceHistoryModel[]) {
        let productHistoryRepository = new ProductPriceHistoryRepository();
        await productHistoryRepository.saveProductPricesFromWebByUrl(website);
    }

    async removeTodayProducts() {
        let productHistoryRepository = new ProductPriceHistoryRepository();

        await productHistoryRepository.removeTodayProducts();
    }

    async removeTodayProductsByWebsite(website:string) {
        let productHistoryRepository = new ProductPriceHistoryRepository();

        await productHistoryRepository.removeTodayProductsByWebsite(website);
    }
}

