import axios from "axios";
// @ts-ignore
import WebsiteModel from "../model/websiteModel";
import ProductHistoryRepository from "../repository/productHistoryRepository";
import ProductHistoryModel from "../model/productHistoryModel";

export default class ProductHistoryService {

    async saveProductsFromWebByUrl(url: string, collections: object[]) {
        let productHistoryRepository = new ProductHistoryRepository()

        let pagination = 1

        for (const collection of collections) {
            let loopContinue = true
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


    async getProductHistoryByDaysAndWebsite(website: string) : Promise<ProductHistoryModel[]>{
        let productHistoryRepository = new ProductHistoryRepository()

        return await productHistoryRepository.getProductHistoryByDaysAndWebsite(website)
    }

}

