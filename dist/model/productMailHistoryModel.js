"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProductMailHistoryModel {
    constructor(storeId, website, url, newValue, oldValue, priceChangeRate, productTitle, imageSrc, currency, createDateTime, mail, newValueAsUsd, oldValueAsUsd, _id) {
        this.storeId = storeId;
        this.website = website;
        this.url = url;
        this.newValue = newValue;
        this.oldValue = oldValue;
        this.priceChangeRate = priceChangeRate;
        this.productTitle = productTitle;
        this.imageSrc = imageSrc;
        this.currency = currency;
        this.createDateTime = createDateTime;
        this.mail = mail;
        this.newValueAsUsd = newValueAsUsd;
        this.oldValueAsUsd = oldValueAsUsd;
        this._id = _id;
    }
}
exports.default = ProductMailHistoryModel;
