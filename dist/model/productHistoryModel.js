"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProductHistoryModel {
    constructor(id, website, created_date_time, collection, url, title, handle, body_html, published_at, created_at, updated_at, vendor, product_type, tags, variants, images, options, _id) {
        this.id = id;
        this.website = website;
        this.created_date_time = created_date_time;
        this.collection = collection;
        this.url = url;
        this.title = title;
        this.handle = handle;
        this.body_html = body_html;
        this.published_at = published_at;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.vendor = vendor;
        this.product_type = product_type;
        this.tags = tags;
        this.variants = variants;
        this.images = images;
        this.options = options;
        this._id = _id;
    }
}
exports.default = ProductHistoryModel;
