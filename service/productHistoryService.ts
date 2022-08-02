import axios from 'axios';
import WebsiteModel from '../model/websiteModel';
import ProductHistoryRepository from '../repository/productHistoryRepository';
import ProductHistoryModel from '../model/productHistoryModel';
import ProductPriceHistoryService from './productPriceHistoryService';
import ProductPriceHistoryModel from '../model/productPriceHistoryModel';
import WebsiteService from './websiteService';
import { getCurrencyRateCorrespondUsd } from '../utility/currencyUtility';

export default class ProductHistoryService {


    /***
     * save product
     * @param website
     */
    async saveProductsFromWebByUrl(website: WebsiteModel) {

        let productHistoryRepository = new ProductHistoryRepository();
        let productPriceHistoryService = new ProductPriceHistoryService();
        let websiteService = new WebsiteService();
        let websiteEntity = await websiteService.getPropertyByUrl({ url: website.url }, { 'cart.currency': 1 });

        let currencyRate = getCurrencyRateCorrespondUsd(websiteEntity);

        let url = website.url;

        await productHistoryRepository.removeProductsByWebsite(url);
        await productPriceHistoryService.removeTodayProductsByWebsite(url);

        let products: ProductHistoryModel[] = [];

        let loopContinue = true;
        let pagination = 1;
        while (loopContinue) {
            try {
                // @ts-ignore
                let readyToRequestUrl = url + '/products.json?limit=250&page=' + pagination;

                let response = await axios.get(readyToRequestUrl);

                let productResponse = response.data;

                if (productResponse.products.length === 0) {
                    loopContinue = false;
                } else {

                    // @ts-ignore
                        productResponse.products.forEach(product => {
                            product.website = url;

                            let date = new Date();

                            //for test yesterday
                            // @ts-ignore
                            date.setDate(date.getDate() - process.env.CRAWL_MINUS_TODAY);

                            product.created_date_time = date;
                            // @ts-ignore
                            product.url = url + '/products/' + product.handle;

                            try {
                                product.published_at = new Date(product.published_at);
                                product.created_at = new Date(product.created_at);
                                product.updated_at = new Date(product.updated_at);
                                // @ts-ignore
                                product.currency = websiteEntity.cart.currency

                                delete product['body_html'];
                            } catch (e) {

                            }

                            try {
                                // @ts-ignore
                                product.variants.forEach(variant => {
                                    if (variant.price) {

                                        variant.price = parseFloat(variant.price);
                                    }

                                    if (variant.compare_at_price) {

                                        variant.compare_at_price = parseFloat(variant.compare_at_price);
                                    }

                                    variant.compare_at_price_usd = Number((variant.price / currencyRate).toFixed(2));
                                    variant.parent_title = product.title

                                    if (variant.created_at) {

                                        variant.created_at = new Date(variant.created_at);
                                    }

                                    if (variant.updated_at) {

                                        variant.updated_at = new Date(variant.updated_at);
                                    }
                                });
                            } catch (e) {
                                console.log('hata1');
                                console.log(e);
                            }

                            product.search = this.prepareSearchColumn(product);

                            products.push(product);

                        });

                    }
                    pagination++;
                } catch (e) {
                    loopContinue = false;
                }
            }


        let productPrices: ProductPriceHistoryModel[] = [];

        //convert product to product prices
        products.forEach(product => {
            // @ts-ignore
            productPrices.push(new ProductPriceHistoryModel(product.id, product.website, websiteEntity.cart.currency, product.created_date_time, product.variants));
        });

        await productHistoryRepository.saveProductsFromWebByUrl(products);
        await productPriceHistoryService.saveProductPriceHistory(productPrices);

    }

    /***
     * get Product History By Product Id
     * @param id
     */
    async getProductHistoryByProductId(id: number): Promise<ProductHistoryModel> {
        let productHistoryRepository = new ProductHistoryRepository();
        return await productHistoryRepository.getProductHistoryByProductId(id);
    }

    /***
     * delete product
     * @param website
     */
    async deleteProductsByWebsite(website: string) {
        let productHistoryRepository = new ProductHistoryRepository();
        await productHistoryRepository.deleteProductsByWebsite(website);
    }

    /***
     * remove Today products
     * NOTE: minus day information in env file
     */
    async removeTodayProducts() {
        let productHistoryRepository = new ProductHistoryRepository();
        let productPriceHistoryRepository = new ProductPriceHistoryService();

        await productHistoryRepository.removeTodayProducts();
        await productPriceHistoryRepository.removeTodayProducts();
    }

    /***
     * today crawled check
     * @param website
     */
    async isCrawledTodayByWebsite(website: string): Promise<boolean> {
        let productHistoryRepository = new ProductHistoryRepository();
        return await productHistoryRepository.isCrawledTodayByWebsite(website);
    }

    /***
     * prepare Search Column
     * @param product
     */
    prepareSearchColumn(product: ProductHistoryModel) {

        let searchArray = [];

        if (product.title) {
            searchArray.push(product.title);
        }

        if (product.handle) {
            searchArray.push(product.handle);
        }

        if (product.vendor) {
            searchArray.push(product.vendor);
        }

        if (product.product_type) {
            searchArray.push(product.product_type);
        }

        if (product.website) {
            searchArray.push(product.website);
        }

        if (product.url) {
            searchArray.push(product.url);
        }

        if (product.tags) {
            product.tags.forEach(tag => {
                if (tag) {

                    searchArray.push(tag);
                }
            });
        }

        if (product.variants) {
            product.variants.forEach(variant => {

                if (variant) {

                    // @ts-ignore
                    if (variant.title) {

                        // @ts-ignore
                        searchArray.push(variant.title);
                    }

                    // @ts-ignore
                    if (variant.option1) {

                        // @ts-ignore
                        searchArray.push(variant.option1);
                    }
                    // @ts-ignore
                    if (variant.option2) {

                        // @ts-ignore
                        searchArray.push(variant.option2);
                    }

                    // @ts-ignore
                    if (variant.option3) {

                        // @ts-ignore
                        searchArray.push(variant.option3);
                    }
                }
            });
        }

        return searchArray.join(' ');
    }
}

