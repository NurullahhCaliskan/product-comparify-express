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
class ProductHistoryService {
    /**
     * save product history
     * @param url url
     * @param collections collection
     */
    saveProductsFromWebByUrl(url, collections) {
        return __awaiter(this, void 0, void 0, function* () {
            let productHistoryRepository = new productHistoryRepository_1.default();
            for (const collection of collections) {
                let loopContinue = true;
                let pagination = 1;
                while (loopContinue) {
                    try {
                        // @ts-ignore
                        let readyToRequestUrl = url + "/collections/" + collection.handle + '/products.json?page=' + pagination;
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
                                product.collection = collection.handle;
                                let date = new Date();
                                //for test yesterday
                                //date.setDate(date.getDate() - 1);
                                product.created_date_time = date;
                                // @ts-ignore
                                product.url = url + "/collections/" + collection.handle + '/products/' + product.handle;
                            });
                            yield productHistoryRepository.saveProductsFromWebByUrl(productResponse.products);
                        }
                        pagination++;
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
            }
        });
    }
    /***
     * get Product History data
     * @param website website
     */
    getProductHistoryByDaysAndWebsite(website) {
        return __awaiter(this, void 0, void 0, function* () {
            let productHistoryRepository = new productHistoryRepository_1.default();
            return yield productHistoryRepository.getProductHistoryByDaysAndWebsite(website);
        });
    }
    removeTodayProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            let productHistoryRepository = new productHistoryRepository_1.default();
            yield productHistoryRepository.removeTodayProducts();
        });
    }
}
exports.default = ProductHistoryService;
