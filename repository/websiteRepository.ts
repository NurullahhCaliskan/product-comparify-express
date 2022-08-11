import { collections } from '../database.service';
import WebsiteModel from '../model/websiteModel';
import { urlFormatter } from '../utility/stringUtility';

export default class WebsiteRepository {

    /***
     * Upser Websites All Colelctions
     * @param url
     * @param collection
     */
    async upsertWebSitesAllCollections(url: string, collection: object) {
        url = urlFormatter(url);
        let query = { url: url };
        let newRecord = { $set: { url: url, collection: collection } };
        // @ts-ignore
        await collections.websitesModel.updateOne(query, newRecord, { upsert: true });
    }

    /***
     * Upsert websites favicon
     * @param url
     * @param faviconUrl
     */
    async upsertWebSitesFavicon(url: string, faviconUrl: string | null) {
        url = urlFormatter(url)
        let query = {url: url};
        let newRecord = {$set: {url: url, faviconUrl: faviconUrl}};
        // @ts-ignore
        await collections.websitesModel.updateOne(query, newRecord, {upsert: true});
    }

    /***
     * upsert web sites cart
     * @param url
     * @param cart
     */
    async upsertWebSitesCart(url: string, cart: object) {
        url = urlFormatter(url)
        let query = {url: url};
        let newRecord = {$set: {url: url, cart: cart}};
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

    /***
     * get websites from queue
     */
    async getWebsitesFromQueue(): Promise<WebsiteModel[]> {
            return await collections.websitesModel?.aggregate([
                {
                    $lookup: {
                        from: 'product-history-crawler-queue',
                        localField: 'url',
                        foreignField: 'website',
                        as: 'websiteData'
                    }
                },
                {$match: {websiteData: {$not: {$size: 0}}}}

            ]).toArray() as WebsiteModel[]
    }

    /***
     * get website by url
     * @param url
     */
    async getWebsiteByUrl(url: string): Promise<WebsiteModel> {

        return await collections.websitesModel?.findOne({ url: url }) as WebsiteModel;
    }

    /***
     * get any property by url
     * @param match
     * @param project
     */
    async getPropertyByUrl(match: object, project: object): Promise<WebsiteModel | null> {

        let response = await collections.websitesModel?.aggregate([
            { $match: match },
            { $project: project },
        ]).toArray() as WebsiteModel[];

        if (response && response.length > 0) {

            return response[0];
        }

        return null;
    }
}
