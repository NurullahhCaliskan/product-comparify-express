import {collections} from "../database.service";
import {getTodayMidnight, getTomorrowMidnight, getYesterdayMidnight} from "../utility/dayUtility";
import ProductHistoryModel from "../model/productHistoryModel";
import {urlFormatter} from "../utility/stringUtility";

export default class ProductHistoryRepository {

    /***
     * save Product by url
     * @param products
     */
    async saveProductsFromWebByUrl(products: object[]) {
        await collections.productHistoryModel?.insertMany(products);
    }

    /***
     * get Product History By days and website
     * @param website website
     */
    async getProductHistoryByDaysAndWebsiteYesterday(website: string): Promise<ProductHistoryModel[]> {
        //find example = { $and: [ { website:"https://www.pipsnacks.com/" }, {created_date_time : { $gte : new ISODate("2022-05-04T00:00:00.000Z") } } ] }

        website = urlFormatter(website)
        let yesterdayMidnight = getYesterdayMidnight()
        let todayMidnight = getTodayMidnight()

        let findJson = {$and: [{website: website}, {created_date_time: {$gte: yesterdayMidnight,$lt:todayMidnight}}]}

        // @ts-ignore
        return await collections.productHistoryModel?.find(findJson).sort({id: 1, created_date_time: -1}).toArray() as ProductHistoryModel[];
    }

    /***
     * get Product History By days and website
     * @param website website
     */
    async getProductHistoryByDaysAndWebsiteToday(website: string): Promise<ProductHistoryModel[]> {
        //find example = { $and: [ { website:"https://www.pipsnacks.com/" }, {created_date_time : { $gte : new ISODate("2022-05-04T00:00:00.000Z") } } ] }

        website = urlFormatter(website)
        let yesterdayMidnight = getYesterdayMidnight()
        let todayMidnight = getTodayMidnight()
        let tomorrowMidnight = getTomorrowMidnight()

        let findJson = {$and: [{website: website}, {created_date_time: {$gte: todayMidnight,$lt:tomorrowMidnight}}]}

        // @ts-ignore
        return await collections.productHistoryModel?.find(findJson).sort({id: 1, created_date_time: -1}).toArray() as ProductHistoryModel[];
    }

    async removeTodayProducts(){
        let start = new Date();
        start.setHours(0,0,0,0);

        let end = new Date();
        end.setHours(23,59,59,999);

        await collections.productHistoryModel?.deleteMany({created_date_time: {$gte: start, $lt: end}})

    }
}
