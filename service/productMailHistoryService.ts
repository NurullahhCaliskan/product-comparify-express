import ProductMailHistoryModel from '../model/productMailHistoryModel';
import ProductMailHistoryRepository from '../repository/productMailHistoryRepository';

export default class ProductMailHistoryService {

    async saveProductMailHistory(productPriceHistoryService: ProductMailHistoryModel) {
        let productMailHistoryRepository = new ProductMailHistoryRepository();
        await productMailHistoryRepository.saveProductMailHistory(productPriceHistoryService);

    }
}

