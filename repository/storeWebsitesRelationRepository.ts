import StoreWebsitesRelationModel from '../model/storeWebsitesRelationModel';
import { collections } from '../database.service';

export default class StoreWebsitesRelationRepository {

    /**
     * get User websites relations
     * @return unique website list
     */
    async getStoreWebsitesRelations(): Promise<StoreWebsitesRelationModel[]> {

        // @ts-ignore
        return await collections.storeWebsitesRelationModel.find({alarm:true}).toArray() as StoreWebsitesRelationModel[];
    }
}
