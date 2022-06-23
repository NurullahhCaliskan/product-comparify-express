import axios from "axios";
// @ts-ignore
import WebsiteModel from "../model/websiteModel";
import ProductHistoryRepository from "../repository/productHistoryRepository";
import ProductHistoryModel from "../model/productHistoryModel";
import ProductPriceHistoryService from "./productPriceHistoryService";
import ProductPriceHistoryModel from "../model/productPriceHistoryModel";

export default class ProductHistoryService {

    /**
     * save product history
     * @param url url
     * @param collections collection
     */
    async saveProductsFromWebByUrl(website: WebsiteModel) {
        let productHistoryRepository = new ProductHistoryRepository()
        let productPriceHistoryService = new ProductPriceHistoryService()

        let url = website.url
        let collections = website.collection

        let products: ProductHistoryModel[] = []

        for (const collection of collections) {
            let loopContinue = true
            let pagination = 1
            while (loopContinue) {
                try {
                    // @ts-ignore
                    let readyToRequestUrl = url + "/collections/" + collection.handle + '/products.json?limit=250&page=' + pagination

                    let response = await axios.get(readyToRequestUrl);

                    let productResponse = response.data

                    if (productResponse.products.length === 0) {
                        loopContinue = false
                    } else {

                        // @ts-ignore
                        productResponse.products.forEach(product => {
                            product.website = url
                            // @ts-ignore
                            product.collection = [collection.handle]

                            let date = new Date()

                            //for test yesterday
                            //date.setDate(date.getDate() - 1);

                            product.created_date_time = date
                            // @ts-ignore
                            product.url = url + "/collections/" + collection.handle + '/products/' + product.handle
                        })

                        this.mergeProducts(products, productResponse.products)
                    }
                    pagination++
                } catch (e) {
                    console.log(e)
                }
            }
        }

        await productHistoryRepository.saveProductsFromWebByUrl(products)

        let productPrices: ProductPriceHistoryModel[] = []

        //convert product to product prices
        products.forEach(product => {
            productPrices.push(new ProductPriceHistoryModel(product.id, product.website, product.created_date_time, product.variants))
        })

        await productPriceHistoryService.saveProductPriceHistory(productPrices)

    }

    async getProductHistoryByProductId(id: number): Promise<ProductHistoryModel> {
        let productHistoryRepository = new ProductHistoryRepository()
        return await productHistoryRepository.getProductHistoryByProductId(id)
    }

    async deleteProductsByWebsite(website: string) {
        let productHistoryRepository = new ProductHistoryRepository()
        await productHistoryRepository.deleteProductsByWebsite(website)
    }

    async removeTodayProducts() {
        let productHistoryRepository = new ProductHistoryRepository()
        let productPriceHistoryRepository = new ProductPriceHistoryService()

        await productHistoryRepository.removeTodayProducts();
        await productPriceHistoryRepository.removeTodayProducts();
    }

    async isCrawledTodayByWebsite(website: string): Promise<boolean> {
        let productHistoryRepository = new ProductHistoryRepository()
        return await productHistoryRepository.isCrawledTodayByWebsite(website);
    }

    mergeProducts(mainList: ProductHistoryModel[], tmpList: ProductHistoryModel[]) {
        tmpList.forEach(item => {
            if (mainList.find(mainItem => mainItem.id === item.id)) {
                // @ts-ignore
                mainList.find(mainItem => mainItem.id === item.id).collection.push(item.collection[0])
            } else {
                mainList.push(item)
            }
        })
    }
}

