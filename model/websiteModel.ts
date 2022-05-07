import {ObjectId} from "mongodb";

export default class WebsiteModel {
    constructor(public url: string, public faviconUrl: string, public collection: object[], public _id?: ObjectId) {
    }
}
