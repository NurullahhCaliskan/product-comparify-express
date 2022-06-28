import { ObjectId } from 'mongodb';

export default class ProductPriceHistoryModel {
    constructor(public id: number,
                public website: string,
                public created_date_time: Date,
                public variants: object[],
                public _id?: ObjectId) {
    }
}
