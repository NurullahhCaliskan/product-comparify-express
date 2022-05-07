import UserWebsitesRelationRepository from "../repository/userWebsitesRelationRepository";
import UserWebsitesRelationModel from "../model/userWebsitesRelationModel";


export default class UserWebsitesRelationService {

    /**
     * get User Website Relations
     */
    async getUserWebsitesRelations(): Promise<UserWebsitesRelationModel[]> {
        let userWebsitesRelationRepository = new UserWebsitesRelationRepository()

        return await userWebsitesRelationRepository.getUserWebsitesRelations()

    }


    getUserFilterWebsiteAndAlarmStatus(userWebsiteRelationList: UserWebsitesRelationModel[], website: string): UserWebsitesRelationModel[] {

        return userWebsiteRelationList.filter(entity => entity.website === website && entity.alarm)
    }
}
