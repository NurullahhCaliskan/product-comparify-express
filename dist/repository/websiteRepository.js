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
    upsertWebSitesAllCollections(url, collection) {
        return __awaiter(this, void 0, void 0, function* () {
            url = (0, stringUtility_1.urlFormatter)(url);
            let query = { url: url };
            let newRecord = { $set: { url: url, collection: collection } };
            // @ts-ignore
            yield database_service_1.collections.websitesModel.updateOne(query, newRecord, { upsert: true });
        });
    }
    upsertWebSitesFavicon(url, faviconUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            url = (0, stringUtility_1.urlFormatter)(url);
            let query = { url: url };
            let newRecord = { $set: { url: url, faviconUrl: faviconUrl } };
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
}
exports.default = WebsiteRepository;
