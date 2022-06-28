import StoreWebsitesRelationRepository from '../repository/storeWebsitesRelationRepository';
import StoreWebsitesRelationModel from '../model/storeWebsitesRelationModel';


export default class StoreWebsitesRelationService {

    /**
     * get User Website Relations
     */
    async getUserWebsitesRelations(): Promise<StoreWebsitesRelationModel[]> {
        let storeWebsitesRelationRepository = new StoreWebsitesRelationRepository();

        return await storeWebsitesRelationRepository.getStoreWebsitesRelations();

    }


    getStoreFilterWebsiteAndAlarmStatus(storeWebsiteRelationList: StoreWebsitesRelationModel[], website: string): StoreWebsitesRelationModel[] {

        return storeWebsiteRelationList.filter(entity => entity.website === website && entity.alarm);
    }
}
