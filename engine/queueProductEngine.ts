import EnginePermissionService from '../service/enginePermissionService';
import StoreWebsitesRelationService from '../service/storeWebsitesRelationService';
import WebsiteService from '../service/websiteService';
import ProductHistoryService from '../service/productHistoryService';
import ProductHistoryCrawlerQueueService from '../service/productHistoryCrawlerQueueService';
import { logger } from '../utility/logUtility';

export default class QueueProductEngine {

    async runEngine() {
        try {

            let enginePermissionService = new EnginePermissionService();

            //if no available, exit
            if (!(await enginePermissionService.isAvailableRunQueueEngine())) {
                return;
            }

            //set unavailable
            await enginePermissionService.setUnavailableQueueEngine();

            let userWebsitesRelationService = new StoreWebsitesRelationService();
            let websiteService = new WebsiteService();
            let productHistoryService = new ProductHistoryService();
            let productHistoryCrawlerQueueService = new ProductHistoryCrawlerQueueService();

            //get websites for collect data
            let websites = await websiteService.getWebsitesFromQueue();

            for (const website of websites) {
                try {


                    let isCrawledToday = await productHistoryService.isCrawledTodayByWebsite(website.url);

                    if (isCrawledToday) {
                        await productHistoryCrawlerQueueService.removeProductQueueByUrl(website.url);
                        continue;
                    }
                    await productHistoryService.deleteProductsByWebsite(website.url);
                    await productHistoryService.saveProductsFromWebByUrl(website);

                    await productHistoryCrawlerQueueService.removeProductQueueByUrl(website.url);
                } catch (e) {

                }
            }

            //set available
            await enginePermissionService.setAvailableQueueEngine();

        } catch (e) {

        }
    }
}
