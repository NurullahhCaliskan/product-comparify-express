"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const productHistoryRepository_1 = __importDefault(require("../repository/productHistoryRepository"));
const productPriceHistoryService_1 = __importDefault(require("./productPriceHistoryService"));
const productPriceHistoryModel_1 = __importDefault(require("../model/productPriceHistoryModel"));
class ProductHistoryService {
    /**
     * save product history
     * @param url url
     * @param collections collection
     */
    saveProductsFromWebByUrl(website) {
        return __awaiter(this, void 0, void 0, function* () {
            let productHistoryRepository = new productHistoryRepository_1.default();
            let productPriceHistoryService = new productPriceHistoryService_1.default();
            let url = website.url;
            let collections = website.collection;
            let products = [];
            for (const collection of collections) {
                let loopContinue = true;
                let pagination = 1;
                while (loopContinue) {
                    try {
                        // @ts-ignore
                        let readyToRequestUrl = url + '/collections/' + collection.handle + '/products.json?limit=250&page=' + pagination;
                        let response = yield axios_1.default.get(readyToRequestUrl);
                        let productResponse = response.data;
                        if (productResponse.products.length === 0) {
                            loopContinue = false;
                        }
                        else {
                            // @ts-ignore
                            productResponse.products.forEach(product => {
                                product.website = url;
                                // @ts-ignore
                                product.collection = [collection.handle];
                                let date = new Date();
                                //for test yesterday
                                //date.setDate(date.getDate() - 1);
                                product.created_date_time = date;
                                // @ts-ignore
                                product.url = url + '/collections/' + collection.handle + '/products/' + product.handle;
                                try {
                                    product.published_at = new Date(product.published_at);
                                    product.created_at = new Date(product.created_at);
                                    product.updated_at = new Date(product.updated_at);
                                }
                                catch (e) {
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
                                        if (variant.created_at) {
                                            variant.created_at = new Date(variant.created_at);
                                        }
                                        if (variant.updated_at) {
                                            variant.updated_at = new Date(variant.updated_at);
                                        }
                                    });
                                }
                                catch (e) {
                                }
                                product.search = this.prepareSearchColumn(product);
                            });
                            this.mergeProducts(products, productResponse.products);
                        }
                        pagination++;
                    }
                    catch (e) {
                        loopContinue = false;
                    }
                }
            }
            yield productHistoryRepository.saveProductsFromWebByUrl(products);
            let productPrices = [];
            //convert product to product prices
            products.forEach(product => {
                productPrices.push(new productPriceHistoryModel_1.default(product.id, product.website, product.created_date_time, product.variants));
            });
            yield productPriceHistoryService.saveProductPriceHistory(productPrices);
        });
    }
    getProductHistoryByProductId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let productHistoryRepository = new productHistoryRepository_1.default();
            return yield productHistoryRepository.getProductHistoryByProductId(id);
        });
    }
    deleteProductsByWebsite(website) {
        return __awaiter(this, void 0, void 0, function* () {
            let productHistoryRepository = new productHistoryRepository_1.default();
            yield productHistoryRepository.deleteProductsByWebsite(website);
        });
    }
    removeTodayProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            let productHistoryRepository = new productHistoryRepository_1.default();
            let productPriceHistoryRepository = new productPriceHistoryService_1.default();
            yield productHistoryRepository.removeTodayProducts();
            yield productPriceHistoryRepository.removeTodayProducts();
        });
    }
    isCrawledTodayByWebsite(website) {
        return __awaiter(this, void 0, void 0, function* () {
            let productHistoryRepository = new productHistoryRepository_1.default();
            return yield productHistoryRepository.isCrawledTodayByWebsite(website);
        });
    }
    mergeProducts(mainList, tmpList) {
        tmpList.forEach(item => {
            if (mainList.find(mainItem => mainItem.id === item.id)) {
                // @ts-ignore
                mainList.find(mainItem => mainItem.id === item.id).collection.push(item.collection[0]);
            }
            else {
                mainList.push(item);
            }
        });
    }
    prepareSearchColumn(product) {
        let searchArray = [];
        if (product.title) {
            searchArray.push(product.title);
        }
        if (product.handle) {
            searchArray.push(product.handle);
        }
        if (product.body_html) {
            searchArray.push(product.body_html);
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
        if (product.collection) {
            product.collection.forEach(collection => {
                if (collection) {
                    searchArray.push(collection);
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
