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
    upsertWebSitesAllCollections(url, collections) {
        return __awaiter(this, void 0, void 0, function* () {
            let websiteRepository = new websiteRepository_1.default();
            yield websiteRepository.upsertWebSitesAllCollections(url, collections);
        });
    }
    upsertWebSitesFavicon(url, collections) {
        return __awaiter(this, void 0, void 0, function* () {
            let websiteRepository = new websiteRepository_1.default();
            yield websiteRepository.upsertWebSitesFavicon(url, collections);
        });
    }
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
    getWebsites() {
        return __awaiter(this, void 0, void 0, function* () {
            let websiteRepository = new websiteRepository_1.default();
            return yield websiteRepository.getWebsites();
        });
    }
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
}
exports.default = WebsiteService;
