import axios from "axios";
// @ts-ignore
import WebsiteModel from "../model/websiteModel";
import ProductHistoryCrawlerQueueRepository from "../repository/productHistoryCrawlerQueueRepository";

export default class ProductHistoryCrawlerQueueService {


    async removeProductPricesFromWebByUrl(website: string) {
        let productHistoryCrawlerQueueRepository = new ProductHistoryCrawlerQueueRepository();
        await productHistoryCrawlerQueueRepository.removeProductPricesFromWebByUrl(website);
    }

}

