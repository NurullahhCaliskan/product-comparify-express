"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProductPriceHistoryWithCompareModel {
    constructor(today_id, today_website, today_currency, today_created_date_time, today_timestamp_id, today_variant, yesterday_id, yesterday_website, yesterday_currency, yesterday_created_date_time, yesterday_timestamp_id, yesterday_variant, _id) {
        this.today_id = today_id;
        this.today_website = today_website;
        this.today_currency = today_currency;
        this.today_created_date_time = today_created_date_time;
        this.today_timestamp_id = today_timestamp_id;
        this.today_variant = today_variant;
        this.yesterday_id = yesterday_id;
        this.yesterday_website = yesterday_website;
        this.yesterday_currency = yesterday_currency;
        this.yesterday_created_date_time = yesterday_created_date_time;
        this.yesterday_timestamp_id = yesterday_timestamp_id;
        this.yesterday_variant = yesterday_variant;
        this._id = _id;
    }
}
exports.default = ProductPriceHistoryWithCompareModel;
