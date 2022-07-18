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
    upsertWebSitesAllCollections(url, collections) {
        return __awaiter(this, void 0, void 0, function* () {
            let websiteRepository = new websiteRepository_1.default();
            yield websiteRepository.upsertWebSitesAllCollections(url, collections);
        });
    }
    /***
     * Upsert websites favicon
     * @param url
     * @param collections
     */
    upsertWebSitesFavicon(url, collections) {
        return __awaiter(this, void 0, void 0, function* () {
            let websiteRepository = new websiteRepository_1.default();
            yield websiteRepository.upsertWebSitesFavicon(url, collections);
        });
    }
    /***
     * upsert web sites cart
     * @param url
     * @param cart
     */
    upsertWebSitesCart(url, cart) {
        return __awaiter(this, void 0, void 0, function* () {
            let websiteRepository = new websiteRepository_1.default();
            yield websiteRepository.upsertWebSitesCart(url, cart);
        });
    }
    /***
     * get Collection by website name from web
     * @param url
     */
    getCollectionByWebsiteNameFromWeb(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response = yield axios_1.default.get(url + '/collections.json');
                return response.data.collections;
            }
            catch (e) {
            }
            return [];
        });
    }
    /***
     * get cart by website name from web
     * @param url
     */
    getCartByWebsiteNameFromWeb(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response = yield axios_1.default.get(url + '/cart.json');
                return response.data;
            }
            catch (e) {
            }
            return {};
        });
    }
    /**
     * get User websites relations
     * @return unique website list
     */
    getWebsites() {
        return __awaiter(this, void 0, void 0, function* () {
            let websiteRepository = new websiteRepository_1.default();
            return yield websiteRepository.getWebsites();
        });
    }
    /***
     * get websites from queue
     */
    getWebsitesFromQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            let websiteRepository = new websiteRepository_1.default();
            return yield websiteRepository.getWebsitesFromQueue();
        });
    }
    /***
     * get website by url
     * @param url
     */
    getWebsiteByUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            let websiteRepository = new websiteRepository_1.default();
            return yield websiteRepository.getWebsiteByUrl(url);
        });
    }
    /***
     * get favicon url
     * @param url
     */
    getFaviconUrlByWebsiteNameFromWeb(url) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = null;
            try {
                let response = yield axios_1.default.get(url);
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
        });
    }
    /***
     * get any property by url
     * @param url
     * @param project
     */
    getPropertyByUrl(url, project) {
        return __awaiter(this, void 0, void 0, function* () {
            let websiteRepository = new websiteRepository_1.default();
            return yield websiteRepository.getPropertyByUrl(url, project);
        });
    }
}
exports.default = WebsiteService;
