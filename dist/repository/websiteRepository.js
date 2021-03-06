"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_service_1 = require("../database.service");
const stringUtility_1 = require("../utility/stringUtility");
class WebsiteRepository {
    /***
     * Upser Websites All Colelctions
     * @param url
     * @param collection
     */
    upsertWebSitesAllCollections(url, collection) {
        return __awaiter(this, void 0, void 0, function* () {
            url = (0, stringUtility_1.urlFormatter)(url);
            let query = { url: url };
            let newRecord = { $set: { url: url, collection: collection } };
            // @ts-ignore
            yield database_service_1.collections.websitesModel.updateOne(query, newRecord, { upsert: true });
        });
    }
    /***
     * Upsert websites favicon
     * @param url
     * @param faviconUrl
     */
    upsertWebSitesFavicon(url, faviconUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            url = (0, stringUtility_1.urlFormatter)(url);
            let query = { url: url };
            let newRecord = { $set: { url: url, faviconUrl: faviconUrl } };
            // @ts-ignore
            yield database_service_1.collections.websitesModel.updateOne(query, newRecord, { upsert: true });
        });
    }
    /***
     * upsert web sites cart
     * @param url
     * @param cart
     */
    upsertWebSitesCart(url, cart) {
        return __awaiter(this, void 0, void 0, function* () {
            url = (0, stringUtility_1.urlFormatter)(url);
            let query = { url: url };
            let newRecord = { $set: { url: url, cart: cart } };
            // @ts-ignore
            yield database_service_1.collections.websitesModel.updateOne(query, newRecord, { upsert: true });
        });
    }
    /**
     * get User websites relations
     * @return unique website list
     */
    getWebsites() {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            return yield database_service_1.collections.websitesModel.find({}).toArray();
        });
    }
    /***
     * get websites from queue
     */
    getWebsitesFromQueue() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return yield ((_a = database_service_1.collections.websitesModel) === null || _a === void 0 ? void 0 : _a.aggregate([
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
        });
    }
    /***
     * get website by url
     * @param url
     */
    getWebsiteByUrl(url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            console.log(url);
            return yield ((_a = database_service_1.collections.websitesModel) === null || _a === void 0 ? void 0 : _a.findOne({ url: url }));
        });
    }
    /***
     * get any property by url
     * @param match
     * @param project
     */
    getPropertyByUrl(match, project) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield ((_a = database_service_1.collections.websitesModel) === null || _a === void 0 ? void 0 : _a.aggregate([
                { $match: match },
                { $project: project },
            ]).toArray());
            if (response && response.length > 0) {
                return response[0];
            }
            return null;
        });
    }
}
exports.default = WebsiteRepository;
