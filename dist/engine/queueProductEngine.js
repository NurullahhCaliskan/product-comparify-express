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
        const job = node_schedule_1.default.scheduleJob((0, cronUtility_1.GET_QUEUE_SCHEDULED_AS_SECOND)(), function () {
            return __awaiter(this, void 0, void 0, function* () {
                console.log('start queue engine');
                try {
                    yield engine.collectQueueProducts();
                }
                catch (e) {
                    console.log(e);
                }
                console.log('end engine');
            });
        });
    }
    collectQueueProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            let enginePermissionService = new enginePermissionService_1.default();
            //if no available, exit
            if (!(yield enginePermissionService.isAvailableRunQueueEngine())) {
                return;
            }
            //set unavailable
            yield enginePermissionService.setUnavailableQueueEngine();
            console.log('start collect queue products');
            let userWebsitesRelationService = new storeWebsitesRelationService_1.default();
            let websiteService = new websiteService_1.default();
            let productHistoryService = new productHistoryService_1.default();
            let productHistoryCrawlerQueueService = new productHistoryCrawlerQueueService_1.default();
            //get websites for collect data
            let websites = yield websiteService.getWebsitesFromQueue();
            for (const website of websites) {
                let isCrawledToday = yield productHistoryService.isCrawledTodayByWebsite(website.url);
                if (isCrawledToday) {
                    console.log("isCrawledToday entered");
                    yield productHistoryCrawlerQueueService.removeProductPricesFromWebByUrl(website.url);
                    continue;
                }
                console.log("isCrawledToday not entered");
                yield productHistoryService.deleteProductsByWebsite(website.url);
                yield productHistoryService.saveProductsFromWebByUrl(website);
                yield productHistoryCrawlerQueueService.removeProductPricesFromWebByUrl(website.url);
            }
            //set available
            yield enginePermissionService.setAvailableQueueEngine();
        });
    }
}
exports.default = QueueProductEngine;
