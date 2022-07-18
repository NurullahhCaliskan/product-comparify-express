import StoreRepository from '../repository/storeRepository';
import StoreModel from '../model/storeModel';

export default class StoreService {
    /***
     * get Store
     * @param storeId
     */
    async getStoreByStoreId(storeId: number): Promise<StoreModel> {
        let storeRepository = new StoreRepository();

        return await storeRepository.getStoreByStoreId(storeId);
    }
}
