import { ObjectId } from 'mongodb';

export default class ProductHistoryCrawlerQueueModel {
    constructor(public website: string,
                public _id?: ObjectId) {
    }
}
