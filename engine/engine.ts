import schedule from 'node-schedule';
import UserWebsitesRelationService from "../service/userWebsitesRelationService";
import WebsiteService from "../service/websiteService";
import ProductHistoryService from "../service/productHistoryService";
import {getYesterdayMidnight, getTodayMidnight} from "../utility/dayUtility";
import {roughSizeOfObject} from "../utility/stackUtility";
import PriceCollector from "./priceCollector";
import setRunPermission, {runPermission} from "./engineConfig";
import UserWebsitesRelationModel from "../model/userWebsitesRelationModel";
import AlarmService from "./alarmService";
import UserModel from "../model/userModel";
import {arrayIsEmpty} from "../utility/arrayUtility";
import MailService from "../mail/mailService";
import {EVERY_SECOND, EVERY_DAY_AT_MIDNIGHT, EVERY_TEN_SECOND} from "../utility/cronUtility";
import EngineHistoryService from "../service/engineHistoryService";
import EngineHistoryModel from "../model/engineHistoryModel";


export default class Engine {

    startEngine() {
        let engine = new Engine();

        const job = schedule.scheduleJob(EVERY_DAY_AT_MIDNIGHT(), async function () {

            if (!runPermission) {
                return;
            }

            setRunPermission(false)

            console.log('start engine1')

            try {
                let engineHistoryService = new EngineHistoryService()

                let engineHistoryModelStart = new EngineHistoryModel(new Date(), "Start Run Engine")
                await engineHistoryService.saveEngineHistory(engineHistoryModelStart)

                await engine.collectAllProducts()

                await engine.prepareAlarmToSendMail()

                let engineHistoryModelEnd = new EngineHistoryModel(new Date(), "End Run Engine")
                await engineHistoryService.saveEngineHistory(engineHistoryModelEnd)

            } catch (e) {
                console.log(e)
            }

            console.log('end engine1')
            setRunPermission(true)
        })
    }

    async collectAllProducts() {
        console.log('start collectAllProducts')
        let userWebsitesRelationService = new UserWebsitesRelationService()
        let websiteService = new WebsiteService()

        await this.syncWebsites()

        //get websites for collect data
        let websites = await websiteService.getWebsites()

        for (const website of websites) {
            let productHistoryService = new ProductHistoryService()
            await productHistoryService.saveProductsFromWebByUrl(website.url, website.collection)
        }
    }

    async prepareAlarmToSendMail() {
        console.log("prepareAlarmToSendMail")
        let userWebsitesRelationService = new UserWebsitesRelationService()
        let productHistoryService = new ProductHistoryService()
        let websiteService = new WebsiteService()
        let alarmService = new AlarmService()

        let usersWhichSendingAlarmList = [] as UserModel[]
        let UserWebsitesRelationList = await userWebsitesRelationService.getUserWebsitesRelations();
        let websitesList = await websiteService.getWebsites()

        let yesterdayMidnight = getYesterdayMidnight()
        let todayMidnight = getTodayMidnight()


        //get unique website list
        for (const website of websitesList) {

            let relevantUserByWebsite = userWebsitesRelationService.getUserFilterWebsiteAndAlarmStatus(UserWebsitesRelationList, website.url)

            //start loop
            let productList = await productHistoryService.getProductHistoryByDaysAndWebsite(website.url)

            //console.log( productList.filter(product => product.id === 6774978412614).length)
            //productList = productList.filter(product => product.id === 6774978412614);

            let yesterdayProductList = productList.filter(product => product.created_date_time > yesterdayMidnight && product.created_date_time < todayMidnight)
            let todayProductList = productList.filter(product => product.created_date_time > todayMidnight)

            //if today or yesterday product lis is empty, go back.
            if (arrayIsEmpty(yesterdayProductList) || arrayIsEmpty(todayProductList)) {
                continue;
            }

            for (const index in yesterdayProductList) {
                let priceCollector = new PriceCollector()

                let priceIdCouple = priceCollector.getPriceChangeVariantListByProduct(todayProductList[index], yesterdayProductList[index])

                //find users which cache product alarm
                await alarmService.setToUserCachedAlarm(usersWhichSendingAlarmList, relevantUserByWebsite, priceIdCouple, yesterdayProductList[index], todayProductList[index]);

            }
        }

        console.log(JSON.stringify(usersWhichSendingAlarmList))

        console.log("send mail to users")
        console.log(usersWhichSendingAlarmList.length)
        for (const userModel of usersWhichSendingAlarmList) {
            let mailService = new MailService()
            await mailService.sendMail(userModel)
        }
    }


    async syncWebsites() {
        let userWebsitesRelationService = new UserWebsitesRelationService()
        let UserWebsitesRelationList = await userWebsitesRelationService.getUserWebsitesRelations();
        //console.log(UserWebsitesRelationList)
        //get unique website list
        const uniqueWebsites = [...new Set(UserWebsitesRelationList.map(item => item.website))]

        //upsert collections
        let websiteService = new WebsiteService()

        console.log(uniqueWebsites)
        for (const website of uniqueWebsites) {
            let collectionResponse = await websiteService.getCollectionByWebsiteNameFromWeb(website);
            if (collectionResponse.length > 0) {
                await websiteService.upsertWebSitesAllCollections(website, collectionResponse)
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
