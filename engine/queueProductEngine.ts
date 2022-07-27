import schedule from 'node-schedule';
import { EVERY_DAY_AT_MIDNIGHT, GET_QUEUE_SCHEDULED_AS_SECOND } from '../utility/cronUtility';
import EnginePermissionService from '../service/enginePermissionService';
import StoreWebsitesRelationService from '../service/storeWebsitesRelationService';
import WebsiteService from '../service/websiteService';
import ProductHistoryService from '../service/productHistoryService';
import ProductHistoryCrawlerQueueService from '../service/productHistoryCrawlerQueueService';

export default class QueueProductEngine {

    startEngine() {
        let engine = new QueueProductEngine();

        // @ts-ignore
        const job = schedule.scheduleJob(GET_QUEUE_SCHEDULED_AS_SECOND(), async function() {


            try {
                await engine.collectQueueProducts();

            } catch (e) {
                console.log(e);
            }

        });
    }


    async collectQueueProducts() {

        let enginePermissionService = new EnginePermissionService();

        //if no available, exit
        if (!(await enginePermissionService.isAvailableRunQueueEngine())) {
            return;
        }

        console.log('start collectQueueProducts');

        //set unavailable
        await enginePermissionService.setUnavailableQueueEngine();

        console.log('start collect queue products');
        let userWebsitesRelationService = new StoreWebsitesRelationService();
        let websiteService = new WebsiteService();
        let productHistoryService = new ProductHistoryService();
        let productHistoryCrawlerQueueService = new ProductHistoryCrawlerQueueService();

        //get websites for collect data
        let websites = await websiteService.getWebsitesFromQueue();

        for (const website of websites) {
            let isCrawledToday = await productHistoryService.isCrawledTodayByWebsite(website.url);

            if (isCrawledToday) {
                console.log('isCrawledToday entered');
                await productHistoryCrawlerQueueService.removeProductQueueByUrl(website.url);
                continue;
            }
            console.log('isCrawledToday not entered');
            await productHistoryService.deleteProductsByWebsite(website.url);
            await productHistoryService.saveProductsFromWebByUrl(website);

            await productHistoryCrawlerQueueService.removeProductQueueByUrl(website.url);
        }

        //set available
        await enginePermissionService.setAvailableQueueEngine();

        console.log('end collectQueueProducts');
    }
}
