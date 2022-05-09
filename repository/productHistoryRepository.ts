import {collections} from "../database.service";
import {getTodayMidnight, getYesterdayMidnight} from "../utility/dayUtility";
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
    async getProductHistoryByDaysAndWebsite(website: string): Promise<ProductHistoryModel[]> {
        //find example = { $and: [ { website:"https://www.pipsnacks.com/" }, {created_date_time : { $gte : new ISODate("2022-05-04T00:00:00.000Z") } } ] }

        website = urlFormatter(website)
        let yesterdayMidnight = getYesterdayMidnight()
        let todayMidnight = getTodayMidnight()

        let findJson = {$and: [{website: website}, {created_date_time: {$gte: yesterdayMidnight}}]}

        // @ts-ignore
        return await collections.productHistoryModel?.find(findJson).sort({id: 1, created_date_time: -1}).toArray() as ProductHistoryModel[];
    }
}
