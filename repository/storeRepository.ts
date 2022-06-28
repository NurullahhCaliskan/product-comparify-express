import { collections } from '../database.service';
import StoreModel from '../model/storeModel';

export default class StoreRepository {

    async getUserByUserId(storeId: number): Promise<StoreModel> {

        // @ts-ignore
        return await collections.storeModel?.findOne({ id: storeId }) as StoreModel;
    }
}
