import { collections } from '../database.service';
import StoreModel from '../model/storeModel';

export default class StoreRepository {

    /***
     * get Store
     * @param storeId
     */
    async getStoreByStoreId(storeId: number): Promise<StoreModel> {

        // @ts-ignore
        return await collections.storeModel?.findOne({ id: storeId }) as StoreModel;
    }
}
