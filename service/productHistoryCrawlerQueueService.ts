import ProductHistoryCrawlerQueueRepository from '../repository/productHistoryCrawlerQueueRepository';

export default class ProductHistoryCrawlerQueueService {

    /**
     * Remoce Product Price from web by url
     * @param website
     */
    async removeProductQueueByUrl(website: string) {
        let productHistoryCrawlerQueueRepository = new ProductHistoryCrawlerQueueRepository();
        await productHistoryCrawlerQueueRepository.removeProductQueueByUrl(website);
    }

}

