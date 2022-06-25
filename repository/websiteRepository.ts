import {collections} from "../database.service";
import WebsiteModel from "../model/websiteModel";
import {urlFormatter} from "../utility/stringUtility";

export default class WebsiteRepository {

    async upsertWebSitesAllCollections(url: string, collection: object) {
        url = urlFormatter(url)
        let query = {url: url};
        let newRecord = {$set: {url: url, collection: collection}};
        // @ts-ignore
        await collections.websitesModel.updateOne(query, newRecord, {upsert: true});
    }

    async upsertWebSitesFavicon(url: string, faviconUrl: string | null) {
        url = urlFormatter(url)
        let query = {url: url};
        let newRecord = {$set: {url: url, faviconUrl: faviconUrl}};
        // @ts-ignore
        await collections.websitesModel.updateOne(query, newRecord, {upsert: true});
    }

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

    /**
     * get User websites relations
     * @return unique website list
     */
    async getWebsiteByUrl(url: string): Promise<WebsiteModel> {

        console.log(url)
        return await collections.websitesModel?.findOne({url: url}) as WebsiteModel;
    }
}
