"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProductPriceHistoryModel {
    constructor(id, website, currency, created_date_time, variants, timestamp_id, _id) {
        this.id = id;
        this.website = website;
        this.currency = currency;
        this.created_date_time = created_date_time;
        this.variants = variants;
        this.timestamp_id = timestamp_id;
        this._id = _id;
    }
}
exports.default = ProductPriceHistoryModel;
