import StoreWebsitesRelationService from '../service/storeWebsitesRelationService';
import WebsiteService from '../service/websiteService';
import ProductHistoryService from '../service/productHistoryService';
import PriceCollector from './priceCollector';
import AlarmService from './alarmService';
import { arrayIsEmpty, convertCompareToDayProductPrices, divideChunks } from '../utility/arrayUtility';
import MailService from '../mail/mailService';
import EngineHistoryService from '../service/engineHistoryService';
import EngineHistoryModel from '../model/engineHistoryModel';
import ProductPriceHistoryService from '../service/productPriceHistoryService';
import EnginePermissionService from '../service/enginePermissionService';
import StoreModel from '../model/storeModel';
import ProductMailHistoryService from '../service/productMailHistoryService';
import ProductMailHistoryModel from '../model/productMailHistoryModel';
import CurrencyService from '../service/currencyService';
import PropertiesService from '../service/propertiesService';
import WebsiteModel from '../model/websiteModel';
import { logger } from '../utility/logUtility';
import { Pool, spawn, Worker } from 'threads';

export default class Engine {

    async runEngine(){
        let enginePermissionService = new EnginePermissionService();
        let engine = new Engine();
        let engineHistoryService = new EngineHistoryService();

        console.log('start engine')
        //if no available, exit
        if (!(await enginePermissionService.isAvailableRunMainEngine())) {
            console.log('engine is not avaible')
            return;
        }

        //set unavailable
        await enginePermissionService.setUnavailableMainEngine();

        console.log('start engine1');

        try {
            await engine.collectAllProducts();
        } catch (e) {
            console.log(e);
        }

        console.log('end engine');
        //set available
        await enginePermissionService.setAvailableMainEngine();

    }

    async collectAllProducts() {
        logger.info(__filename + 'start collectAllProducts');
        let websiteService = new WebsiteService();
        let engineHistoryService = new EngineHistoryService();
        let currencyService = new CurrencyService();
        let propertiesService = new PropertiesService();
        let productHistoryService = new ProductPriceHistoryService();
        if (process.env.PERMISSION_CONVERT_CURRENCY === 'true') {
            logger.info(__filename + 'start save currencies by api');
            await currencyService.saveCurrenciesByApi();

        }

        let chunkedProperties = await propertiesService.getPropertiesByText('scrap-chunk-count');

        await engineHistoryService.saveEngineHistory(new EngineHistoryModel(new Date(), new Date(),new Date(),1,chunkedProperties.value));

        await currencyService.refreshCurrencyList();

        await this.syncWebsites();
        await productHistoryService.syncPricesHistoryBeforeStartEngine();

        //get websites for collect data
        let websites = await websiteService.getWebsites();

        await this.runners(websites);

    }

    async runners(websites: WebsiteModel[]) {
        let propertiesService = new PropertiesService();
        let engineHistoryService = new EngineHistoryService();

        const pool = Pool(() => spawn(new Worker('engineThreadWorker')));

        const myTasks = [];

        let chunkedProperties = await propertiesService.getPropertiesByText('scrap-chunk-count');

        let chunkedWebsites = divideChunks(websites, chunkedProperties.value);

        try {

            for (let input = 0; input < chunkedProperties.value; input++) {
                myTasks.push(pool.queue(worker => worker(chunkedWebsites[input])));
            }
        } catch (e) {
            logger.info(__filename + e);
        }
        await Promise.all(myTasks);
        await pool.terminate(true);
        logger.info(__filename + ' complete collect');
        //finish engines

        await engineHistoryService.saveEngineHistory(new EngineHistoryModel(new Date(), new Date(), new Date(), 2, 0));
        try {

            await this.prepareAlarmToSendMail();
            await engineHistoryService.saveEngineHistory(new EngineHistoryModel(new Date(), new Date(), new Date(), 0, 0));
            logger.info(__filename + ' complete engine');
        } catch (e) {
            logger.error(__filename + 'catch3' + e);
            let date = new Date();
            date.setFullYear(2000)
            await engineHistoryService.saveEngineHistory(new EngineHistoryModel(new Date(),new Date(), date,0,0));

        }

    }

    async prepareAlarmToSendMail() {
        console.log('prepareAlarmToSendMail');
        let storeWebsitesRelationService = new StoreWebsitesRelationService();
        let productHistoryService = new ProductHistoryService();
        let productPriceHistoryService = new ProductPriceHistoryService();
        let websiteService = new WebsiteService();
        let alarmService = new AlarmService();
        let productMailHistoryService = new ProductMailHistoryService();

        let storesWhichSendingAlarmList = [] as StoreModel[];
        let storeWebsitesRelationList = await storeWebsitesRelationService.getUserWebsitesRelations();
        let websitesList = await websiteService.getWebsites();

        //get unique website list
        for (const website of websitesList) {

            let relevantUserByWebsite = storeWebsitesRelationService.getStoreFilterWebsiteAndAlarmStatus(storeWebsitesRelationList, website.url);

            if(relevantUserByWebsite.length === 0){
                continue;
            }

            let productsWithCompareList = await productPriceHistoryService.getProductHistoryWithCompare(website.url);


            //if today or yesterday product lis is empty, go back.
            if (arrayIsEmpty(productsWithCompareList)) {
                continue;
            }

            for (const index in productsWithCompareList) {
                let priceCollector = new PriceCollector();
                let id = productsWithCompareList[index].today_id;

                // @ts-ignore
                let priceIdCouple = priceCollector.getPriceChangeVariantListByProduct(productsWithCompareList[index].today_variant.price, productsWithCompareList[index].yesterday_variant.price);

                let [today, yesterday] = convertCompareToDayProductPrices(productsWithCompareList[index]);

                await alarmService.setToUserCachedAlarm(storesWhichSendingAlarmList, relevantUserByWebsite, priceIdCouple, yesterday, today);

            }

        }

        console.log(JSON.stringify(storesWhichSendingAlarmList));

        console.log('send mail to users');
        console.log(storesWhichSendingAlarmList.length);
        for (const storeModel of storesWhichSendingAlarmList) {
            let mailService = new MailService();
            await mailService.sendMail(storeModel);

            // @ts-ignore
            for (const cachedAlarm of storeModel.cachedAlarm) {
                let productMailHistoryModel = new ProductMailHistoryModel(storeModel.id, cachedAlarm.website, cachedAlarm.url, cachedAlarm.newValue, cachedAlarm.oldValue, cachedAlarm.priceChangeRate, cachedAlarm.productTitle, cachedAlarm.src, cachedAlarm.currency, new Date, storeModel.selectedMail,cachedAlarm.newValueAsUsd,cachedAlarm.oldValueAsUsd );

                await productMailHistoryService.saveProductMailHistory(productMailHistoryModel);
            }
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
