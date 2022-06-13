import axios from "axios";
// @ts-ignore
import WebsiteModel from "../model/websiteModel";
import ProductHistoryRepository from "../repository/productHistoryRepository";
import ProductHistoryModel from "../model/productHistoryModel";

export default class ProductHistoryService {

    /**
     * save product history
     * @param url url
     * @param collections collection
     */
    async saveProductsFromWebByUrl(url: string, collections: object[]) {
        let productHistoryRepository = new ProductHistoryRepository()

        for (const collection of collections) {
            let loopContinue = true
            let pagination = 1
            while (loopContinue) {
                try {
                    // @ts-ignore
                    let readyToRequestUrl = url + "/collections/" + collection.handle + '/products.json?page=' + pagination

                    let response = await axios.get(readyToRequestUrl);

                    let productResponse = response.data

                    if (productResponse.products.length === 0) {
                        loopContinue = false
                    } else {

                        // @ts-ignore
                        productResponse.products.forEach(product => {
                            product.website = url
                            // @ts-ignore
                            product.collection = collection.handle

                            let date = new Date()


                            //for test yesterday
                            //date.setDate(date.getDate() - 1);

                            product.created_date_time = date
                            // @ts-ignore
                            product.url = url + "/collections/" + collection.handle + '/products/' + product.handle
                        })

                        await productHistoryRepository.saveProductsFromWebByUrl(productResponse.products)
                    }
                    pagination++
                } catch (e) {
                    console.log(e)
                }
            }
        }
    }

    /***
     * get Product History data
     * @param website website
     */
    async getProductHistoryByDaysAndWebsiteYesterday(website: string): Promise<ProductHistoryModel[]> {
        let productHistoryRepository = new ProductHistoryRepository()

        return await productHistoryRepository.getProductHistoryByDaysAndWebsiteYesterday(website)
    }

    /***
     * get Product History data
     * @param website website
     */
    async getProductHistoryByDaysAndWebsiteToday(website: string): Promise<ProductHistoryModel[]> {
        let productHistoryRepository = new ProductHistoryRepository()

        return await productHistoryRepository.getProductHistoryByDaysAndWebsiteToday(website)
    }

    async removeTodayProducts(){
        let productHistoryRepository = new ProductHistoryRepository()

        await productHistoryRepository.removeTodayProducts();
    }

}

