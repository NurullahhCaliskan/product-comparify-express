import WebsiteRepository from "../repository/websiteRepository";
import axios from "axios";
// @ts-ignore
import JSSoup from "jssoup";
import WebsiteModel from '../model/websiteModel';

export default class WebsiteService {

    /***
     * Upser Websites All Colelctions
     * @param url
     * @param collections
     */
    async upsertWebSitesAllCollections(url: string, collections: object) {
        let websiteRepository = new WebsiteRepository();

        await websiteRepository.upsertWebSitesAllCollections(url, collections);
    }

    /***
     * Upsert websites favicon
     * @param url
     * @param collections
     */
    async upsertWebSitesFavicon(url: string, collections: string|null) {
        let websiteRepository = new WebsiteRepository();

        await websiteRepository.upsertWebSitesFavicon(url, collections);
    }

    /***
     * upsert web sites cart
     * @param url
     * @param cart
     */
    async upsertWebSitesCart(url: string, cart: object) {
        let websiteRepository = new WebsiteRepository();

        await websiteRepository.upsertWebSitesCart(url, cart);
    }

    /***
     * get Collection by website name from web
     * @param url
     */
    async getCollectionByWebsiteNameFromWeb(url: string): Promise<any[]> {
        try {

            let response = await axios.get(url + '/collections.json');

            return response.data.collections;
        } catch (e) {

        }
        return [];
    }

    /***
     * get cart by website name from web
     * @param url
     */
    async getCartByWebsiteNameFromWeb(url: string): Promise<object> {
        try {

            let response = await axios.get(url + '/cart.json');

            return response.data;
        } catch (e) {

        }
        return {};
    }

    /**
     * get User websites relations
     * @return unique website list
     */
    async getWebsites() : Promise<WebsiteModel[]>{
        let websiteRepository = new WebsiteRepository()
        return await websiteRepository.getWebsites()
    }

    /***
     * get websites from queue
     */
    async getWebsitesFromQueue() : Promise<WebsiteModel[]>{
        let websiteRepository = new WebsiteRepository()
        return await websiteRepository.getWebsitesFromQueue()
    }

    /***
     * get website by url
     * @param url
     */
    async getWebsiteByUrl(url:string) : Promise<WebsiteModel>{
        let websiteRepository = new WebsiteRepository()
        return await websiteRepository.getWebsiteByUrl(url)
    }

    /***
     * get favicon url
     * @param url
     */
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

    /***
     * get any property by url
     * @param url
     * @param project
     */
    async getPropertyByUrl(url:object,project:object) :Promise<WebsiteModel| null>{
        let websiteRepository = new WebsiteRepository()
        return await websiteRepository.getPropertyByUrl(url,project)
    }


}
