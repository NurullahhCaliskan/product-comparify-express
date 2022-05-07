import UserWebsitesRelationModel from "../model/userWebsitesRelationModel";
import {collections} from "../database.service";

export default class UserWebsitesRelationRepository {

    /**
     * get User websites relations
     * @return unique website list
     */
    async getUserWebsitesRelations(): Promise<UserWebsitesRelationModel[]> {

        // @ts-ignore
        return await collections.userWebsitesRelationModel.find({}).toArray() as UserWebsitesRelationModel[]
    }
}
