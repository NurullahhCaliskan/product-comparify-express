"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WebsiteModel {
    constructor(url, faviconUrl, collection, cart, _id) {
        this.url = url;
        this.faviconUrl = faviconUrl;
        this.collection = collection;
        this.cart = cart;
        this._id = _id;
    }
}
exports.default = WebsiteModel;
