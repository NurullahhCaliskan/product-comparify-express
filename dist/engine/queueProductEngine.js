"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_schedule_1 = __importDefault(require("node-schedule"));
const cronUtility_1 = require("../utility/cronUtility");
const enginePermissionService_1 = __importDefault(require("../service/enginePermissionService"));
const storeWebsitesRelationService_1 = __importDefault(require("../service/storeWebsitesRelationService"));
const websiteService_1 = __importDefault(require("../service/websiteService"));
const productHistoryService_1 = __importDefault(require("../service/productHistoryService"));
const productHistoryCrawlerQueueService_1 = __importDefault(require("../service/productHistoryCrawlerQueueService"));
class QueueProductEngine {
    startEngine() {
        let engine = new QueueProductEngine();
        // @ts-ignore
        const job = node_schedule_1.default.scheduleJob((0, cronUtility_1.GET_QUEUE_SCHEDULED_AS_SECOND)(), async function () {
            try {
                await engine.collectQueueProducts();
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    async collectQueueProducts() {
        let enginePermissionService = new enginePermissionService_1.default();
        //if no available, exit
        if (!(await enginePermissionService.isAvailableRunQueueEngine())) {
            return;
        }
        console.log('start collectQueueProducts');
        //set unavailable
        await enginePermissionService.setUnavailableQueueEngine();
        console.log('start collect queue products');
        let userWebsitesRelationService = new storeWebsitesRelationService_1.default();
        let websiteService = new websiteService_1.default();
        let productHistoryService = new productHistoryService_1.default();
        let productHistoryCrawlerQueueService = new productHistoryCrawlerQueueService_1.default();
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
exports.default = QueueProductEngine;
