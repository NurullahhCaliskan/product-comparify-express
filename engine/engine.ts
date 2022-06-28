import schedule from 'node-schedule';
import StoreWebsitesRelationService from '../service/storeWebsitesRelationService';
import WebsiteService from '../service/websiteService';
import ProductHistoryService from '../service/productHistoryService';
import PriceCollector from './priceCollector';
import AlarmService from './alarmService';
import { arrayIsEmpty } from '../utility/arrayUtility';
import MailService from '../mail/mailService';
import { EVERY_SECOND, EVERY_DAY_AT_MIDNIGHT, EVERY_TEN_SECOND, GET_MAIN_SCHEDULED_AS_SECOND } from '../utility/cronUtility';
import EngineHistoryService from '../service/engineHistoryService';
import EngineHistoryModel from '../model/engineHistoryModel';
import ProductPriceHistoryService from '../service/productPriceHistoryService';
import EnginePermissionService from '../service/enginePermissionService';
import StoreModel from '../model/storeModel';


export default class Engine {

    startEngine() {
        let enginePermissionService = new EnginePermissionService();
        let engine = new Engine();

        // @ts-ignore
        const job = schedule.scheduleJob(GET_MAIN_SCHEDULED_AS_SECOND(), async function() {

            //if no available, exit
            if (!(await enginePermissionService.isAvailableRunMainEngine())) {
                return;
            }

            //set unavailable
            await enginePermissionService.setUnavailableMainEngine();

            console.log('start engine1');

            try {
                let engineHistoryService = new EngineHistoryService();

                let engineHistoryModelStart = new EngineHistoryModel(new Date(), 'Start Run Engine');
                await engineHistoryService.saveEngineHistory(engineHistoryModelStart);

                await engine.collectAllProducts();

                await engine.prepareAlarmToSendMail();

                let engineHistoryModelEnd = new EngineHistoryModel(new Date(), 'End Run Engine');
                await engineHistoryService.saveEngineHistory(engineHistoryModelEnd);

            } catch (e) {
                console.log(e);
            }

            console.log('end engine');
            //set available
            await enginePermissionService.setAvailableMainEngine();
        });
    }

    async collectAllProducts() {

        console.log('start collectAllProducts');
        let userWebsitesRelationService = new StoreWebsitesRelationService();
        let websiteService = new WebsiteService();
        let productHistoryService = new ProductHistoryService();

        await productHistoryService.removeTodayProducts();

        await this.syncWebsites();

        //get websites for collect data
        let websites = await websiteService.getWebsites();

        for (const website of websites) {

            await productHistoryService.deleteProductsByWebsite(website.url);
            await productHistoryService.saveProductsFromWebByUrl(website);

        }
    }


    async prepareAlarmToSendMail() {
        console.log('prepareAlarmToSendMail');
        let storeWebsitesRelationService = new StoreWebsitesRelationService();
        let productHistoryService = new ProductHistoryService();
        let productPriceHistoryService = new ProductPriceHistoryService();
        let websiteService = new WebsiteService();
        let alarmService = new AlarmService();

        let storesWhichSendingAlarmList = [] as StoreModel[];
        let storeWebsitesRelationList = await storeWebsitesRelationService.getUserWebsitesRelations();
        let websitesList = await websiteService.getWebsites();

        //get unique website list
        for (const website of websitesList) {

            let relevantUserByWebsite = storeWebsitesRelationService.getStoreFilterWebsiteAndAlarmStatus(storeWebsitesRelationList, website.url);

            let yesterdayProductList = await productPriceHistoryService.getProductHistoryByDaysAndWebsiteYesterday(website.url);
            let todayProductList = await productPriceHistoryService.getProductHistoryByDaysAndWebsiteToday(website.url);

            //if today or yesterday product lis is empty, go back.
            if (arrayIsEmpty(yesterdayProductList) || arrayIsEmpty(todayProductList)) {
                continue;
            }

            for (const index in yesterdayProductList) {
                let priceCollector = new PriceCollector();

                let priceIdCouple = priceCollector.getPriceChangeVariantListByProduct(todayProductList[index], yesterdayProductList[index]);

                //find users which cache product alarm
                await alarmService.setToUserCachedAlarm(storesWhichSendingAlarmList, relevantUserByWebsite, priceIdCouple, yesterdayProductList[index], todayProductList[index]);

            }
        }

        console.log(JSON.stringify(storesWhichSendingAlarmList));

        console.log('send mail to users');
        console.log(storesWhichSendingAlarmList.length);
        for (const storeModel of storesWhichSendingAlarmList) {
            let mailService = new MailService();
            await mailService.sendMail(storeModel);
        }
    }


    async syncWebsites() {
        let userWebsitesRelationService = new StoreWebsitesRelationService();
        let UserWebsitesRelationList = await userWebsitesRelationService.getUserWebsitesRelations();
        //console.log(UserWebsitesRelationList)
        //get unique website list
        const uniqueWebsites = [...new Set(UserWebsitesRelationList.map(item => item.website))];

        //upsert collections
        let websiteService = new WebsiteService();

        console.log(uniqueWebsites);
        for (const website of uniqueWebsites) {
            let collectionResponse = await websiteService.getCollectionByWebsiteNameFromWeb(website);
            if (collectionResponse.length > 0) {
                await websiteService.upsertWebSitesAllCollections(website, collectionResponse);
            }
        }

        //load websites favicon
        for (const website of uniqueWebsites) {
            let collectionResponse = await websiteService.getFaviconUrlByWebsiteNameFromWeb(website);
            await websiteService.upsertWebSitesFavicon(website, collectionResponse);
        }

        //load websites cart
        for (const website of uniqueWebsites) {
            let collectionResponse = await websiteService.getCartByWebsiteNameFromWeb(website);
            await websiteService.upsertWebSitesCart(website, collectionResponse);
        }
    }

}
