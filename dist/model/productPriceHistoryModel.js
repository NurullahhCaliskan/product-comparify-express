"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProductPriceHistoryModel {
    constructor(id, website, currency, created_date_time, variants, _id) {
        this.id = id;
        this.website = website;
        this.currency = currency;
        this.created_date_time = created_date_time;
        this.variants = variants;
        this._id = _id;
    }
}
exports.default = ProductPriceHistoryModel;
