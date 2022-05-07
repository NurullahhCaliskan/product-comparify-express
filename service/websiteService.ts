import WebsiteRepository from "../repository/websiteRepository";
import axios from "axios";
// @ts-ignore
import JSSoup from "jssoup";
import WebsiteModel from "../model/websiteModel";

export default class WebsiteService {

    async upsertWebSitesAllCollections(url: string, collections: object) {
        let websiteRepository = new WebsiteRepository();

        await websiteRepository.upsertWebSitesAllCollections(url, collections);
    }

    async upsertWebSitesFavicon(url: string, collections: string|null) {
        let websiteRepository = new WebsiteRepository();

        await websiteRepository.upsertWebSitesFavicon(url, collections);
    }

    async getCollectionByWebsiteNameFromWeb(url: string): Promise<any[]> {
        try {

            let response = await axios.get(url + '/collections.json');

            return response.data.collections;
        } catch (e) {

        }
        return [];
    }

    async getWebsites() : Promise<WebsiteModel[]>{
        let websiteRepository = new WebsiteRepository()
        return await websiteRepository.getWebsites()
    }

    async getFaviconUrlByWebsiteNameFromWeb(url: string): Promise<string | null> {
        let result = null
        try {
            let response = await axios.get(url);

            let soup = new JSSoup(response.data);
            let linkTag = soup.findAll('link')

            linkTag.forEach((tag: any) => {
                if (tag.attrs.rel === "shortcut icon") {
                    result= tag.attrs.href
                }
            })

        } catch (e) {

        }

        return result;
    }

}
