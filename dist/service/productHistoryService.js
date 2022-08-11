"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const productHistoryRepository_1 = __importDefault(require("../repository/productHistoryRepository"));
const productPriceHistoryService_1 = __importDefault(require("./productPriceHistoryService"));
const productPriceHistoryModel_1 = __importDefault(require("../model/productPriceHistoryModel"));
const websiteService_1 = __importDefault(require("./websiteService"));
const currencyUtility_1 = require("../utility/currencyUtility");
const logUtility_1 = require("../utility/logUtility");
const dayUtility_1 = require("../utility/dayUtility");
class ProductHistoryService {
    /***
     * save product
     * @param website
     */
    async saveProductsFromWebByUrl(website) {
        let productHistoryRepository = new productHistoryRepository_1.default();
        let productPriceHistoryService = new productPriceHistoryService_1.default();
        let websiteService = new websiteService_1.default();
        let websiteEntity = await websiteService.getPropertyByUrl({ url: website.url }, { 'cart.currency': 1 });
        let currencyRate = (0, currencyUtility_1.getCurrencyRateCorrespondUsd)(websiteEntity);
        let url = website.url;
        await productHistoryRepository.removeProductsByWebsite(url);
        await productPriceHistoryService.removeTodayProductsByWebsite(url);
        let loopContinue = true;
        let pagination = 1;
        while (loopContinue) {
            try {
                let products = [];
                // @ts-ignore
                let readyToRequestUrl = url + '/products.json?limit=250&page=' + pagination;
                let response = await axios_1.default.get(readyToRequestUrl);
                let productResponse = response.data;
                //limited 30k product
                if (productResponse.products.length === 0 || pagination >= 120) {
                    loopContinue = false;
                }
                else {
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
                            product.currency = websiteEntity.cart.currency;
                            delete product['body_html'];
                        }
                        catch (e) {
                            logUtility_1.logger.error(__filename + 'catch4' + e + " url:" + url);
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
                                variant.parent_title = product.title;
                                if (variant.created_at) {
                                    variant.created_at = new Date(variant.created_at);
                                }
                                if (variant.updated_at) {
                                    variant.updated_at = new Date(variant.updated_at);
                                }
                            });
                        }
                        catch (e) {
                            logUtility_1.logger.error(__filename + 'catch2' + e + " url:" + url);
                            console.log(e);
                        }
                        product.search = this.prepareSearchColumn(product);
                        products.push(product);
                    });
                }
                let productPrices = [];
                //convert product to product prices
                products.forEach(product => {
                    // @ts-ignore
                    productPrices.push(new productPriceHistoryModel_1.default(product.id, product.website, websiteEntity.cart.currency, product.created_date_time, product.variants, (0, dayUtility_1.getTodayAsNumber)()));
                });
                await productHistoryRepository.saveProductsFromWebByUrl(products);
                await productPriceHistoryService.saveProductPriceHistory(productPrices);
                pagination++;
            }
            catch (e) {
                logUtility_1.logger.error(__filename + +'catch1' + e);
                loopContinue = false;
            }
        }
    }
    /***
     * get Product History By Product Id
     * @param id
     */
    async getProductHistoryByProductId(id) {
        let productHistoryRepository = new productHistoryRepository_1.default();
        return await productHistoryRepository.getProductHistoryByProductId(id);
    }
    /***
     * delete product
     * @param website
     */
    async deleteProductsByWebsite(website) {
        let productHistoryRepository = new productHistoryRepository_1.default();
        await productHistoryRepository.deleteProductsByWebsite(website);
    }
    /***
     * remove Today products
     * NOTE: minus day information in env file
     */
    async removeTodayProducts() {
        let productHistoryRepository = new productHistoryRepository_1.default();
        let productPriceHistoryRepository = new productPriceHistoryService_1.default();
        await productHistoryRepository.removeTodayProducts();
        await productPriceHistoryRepository.removeTodayProducts();
    }
    /***
     * today crawled check
     * @param website
     */
    async isCrawledTodayByWebsite(website) {
        let productHistoryRepository = new productHistoryRepository_1.default();
        return await productHistoryRepository.isCrawledTodayByWebsite(website);
    }
    /***
     * prepare Search Column
     * @param product
     */
    prepareSearchColumn(product) {
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
exports.default = ProductHistoryService;
