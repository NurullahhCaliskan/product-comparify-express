import {collections} from "../database.service";
import UserWebsitesRelationModel from "../model/userWebsitesRelationModel";
import WebsiteModel from "../model/websiteModel";

export default class WebsiteRepository {

    async upsertWebSitesAllCollections(url: string, collection: object) {

        let query = {url: url};
        let newRecord = {$set: {url: url, collection: collection}};
        // @ts-ignore
        await collections.websitesModel.updateOne(query, newRecord, {upsert: true});
    }

    async upsertWebSitesFavicon(url: string, faviconUrl: string | null) {

        let query = {url: url};
        let newRecord = {$set: {url: url, faviconUrl: faviconUrl}};
        // @ts-ignore
        await collections.websitesModel.updateOne(query, newRecord, {upsert: true});
    }

    /**
     * get User websites relations
     * @return unique website list
     */
    async getWebsites(): Promise<WebsiteModel[]> {
        // @ts-ignore
        return await collections.websitesModel.find({}).toArray() as WebsiteModel[]
    }
}
