"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const websiteRepository_1 = __importDefault(require("../repository/websiteRepository"));
const axios_1 = __importDefault(require("axios"));
// @ts-ignore
const jssoup_1 = __importDefault(require("jssoup"));
class WebsiteService {
    /***
     * Upser Websites All Colelctions
     * @param url
     * @param collections
     */
    async upsertWebSitesAllCollections(url, collections) {
        let websiteRepository = new websiteRepository_1.default();
        await websiteRepository.upsertWebSitesAllCollections(url, collections);
    }
    /***
     * Upsert websites favicon
     * @param url
     * @param collections
     */
    async upsertWebSitesFavicon(url, collections) {
        let websiteRepository = new websiteRepository_1.default();
        await websiteRepository.upsertWebSitesFavicon(url, collections);
    }
    /***
     * upsert web sites cart
     * @param url
     * @param cart
     */
    async upsertWebSitesCart(url, cart) {
        let websiteRepository = new websiteRepository_1.default();
        await websiteRepository.upsertWebSitesCart(url, cart);
    }
    /***
     * get Collection by website name from web
     * @param url
     */
    async getCollectionByWebsiteNameFromWeb(url) {
        try {
            let response = await axios_1.default.get(url + '/collections.json');
            return response.data.collections;
        }
        catch (e) {
        }
        return [];
    }
    /***
     * get cart by website name from web
     * @param url
     */
    async getCartByWebsiteNameFromWeb(url) {
        try {
            let response = await axios_1.default.get(url + '/cart.json');
            return response.data;
        }
        catch (e) {
        }
        return {};
    }
    /**
     * get User websites relations
     * @return unique website list
     */
    async getWebsites() {
        let websiteRepository = new websiteRepository_1.default();
        return await websiteRepository.getWebsites();
    }
    /***
     * get websites from queue
     */
    async getWebsitesFromQueue() {
        let websiteRepository = new websiteRepository_1.default();
        return await websiteRepository.getWebsitesFromQueue();
    }
    /***
     * get website by url
     * @param url
     */
    async getWebsiteByUrl(url) {
        let websiteRepository = new websiteRepository_1.default();
        return await websiteRepository.getWebsiteByUrl(url);
    }
    /***
     * get favicon url
     * @param url
     */
    async getFaviconUrlByWebsiteNameFromWeb(url) {
        let result = null;
        try {
            let response = await axios_1.default.get(url);
            let soup = new jssoup_1.default(response.data);
            let linkTag = soup.findAll('link');
            linkTag.forEach((tag) => {
                if (tag.attrs.rel === "shortcut icon") {
                    result = tag.attrs.href;
                }
            });
        }
        catch (e) {
        }
        return result;
    }
    /***
     * get any property by url
     * @param url
     * @param project
     */
    async getPropertyByUrl(url, project) {
        let websiteRepository = new websiteRepository_1.default();
        return await websiteRepository.getPropertyByUrl(url, project);
    }
}
exports.default = WebsiteService;
