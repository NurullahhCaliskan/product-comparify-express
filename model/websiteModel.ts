import { ObjectId } from 'mongodb';

export default class WebsiteModel {
    constructor(public url: string, public faviconUrl: string, public collection: object[],
                public cart: { token: string, note: null, attributes: [], original_total_price: number, total_price: number, total_discount: number, total_weight: number, item_count: number, items: [], requires_shipping: boolean, currency: string, items_subtotal_price: number, cart_level_discount_applications: [] }, public _id?: ObjectId) {
    }
}
