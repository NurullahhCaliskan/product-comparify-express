"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_service_1 = require("../database.service");
const stringUtility_1 = require("../utility/stringUtility");
class WebsiteRepository {
    /***
     * Upser Websites All Colelctions
     * @param url
     * @param collection
     */
    async upsertWebSitesAllCollections(url, collection) {
        url = (0, stringUtility_1.urlFormatter)(url);
        let query = { url: url };
        let newRecord = { $set: { url: url, collection: collection } };
        // @ts-ignore
        await database_service_1.collections.websitesModel.updateOne(query, newRecord, { upsert: true });
    }
    /***
     * Upsert websites favicon
     * @param url
     * @param faviconUrl
     */
    async upsertWebSitesFavicon(url, faviconUrl) {
        url = (0, stringUtility_1.urlFormatter)(url);
        let query = { url: url };
        let newRecord = { $set: { url: url, faviconUrl: faviconUrl } };
        // @ts-ignore
        await database_service_1.collections.websitesModel.updateOne(query, newRecord, { upsert: true });
    }
    /***
     * upsert web sites cart
     * @param url
     * @param cart
     */
    async upsertWebSitesCart(url, cart) {
        url = (0, stringUtility_1.urlFormatter)(url);
        let query = { url: url };
        let newRecord = { $set: { url: url, cart: cart } };
        // @ts-ignore
        await database_service_1.collections.websitesModel.updateOne(query, newRecord, { upsert: true });
    }
    /**
     * get User websites relations
     * @return unique website list
     */
    async getWebsites() {
        // @ts-ignore
        return await database_service_1.collections.websitesModel.find({}).toArray();
    }
    /***
     * get websites from queue
     */
    async getWebsitesFromQueue() {
        var _a;
        return await ((_a = database_service_1.collections.websitesModel) === null || _a === void 0 ? void 0 : _a.aggregate([
            {
                $lookup: {
                    from: 'product-history-crawler-queue',
                    localField: 'url',
                    foreignField: 'website',
                    as: 'websiteData'
                }
            },
            { $match: { websiteData: { $not: { $size: 0 } } } }
        ]).toArray());
    }
    /***
     * get website by url
     * @param url
     */
    async getWebsiteByUrl(url) {
        var _a;
        return await ((_a = database_service_1.collections.websitesModel) === null || _a === void 0 ? void 0 : _a.findOne({ url: url }));
    }
    /***
     * get any property by url
     * @param match
     * @param project
     */
    async getPropertyByUrl(match, project) {
        var _a;
        let response = await ((_a = database_service_1.collections.websitesModel) === null || _a === void 0 ? void 0 : _a.aggregate([
            { $match: match },
            { $project: project },
        ]).toArray());
        if (response && response.length > 0) {
            return response[0];
        }
        return null;
    }
}
exports.default = WebsiteRepository;
