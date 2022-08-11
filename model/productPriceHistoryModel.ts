import { ObjectId } from 'mongodb';

export default class ProductPriceHistoryModel {
    constructor(public id: number,
                public website: string,
                public currency: string,
                public created_date_time: Date,
                public variants: object[],
                public timestamp_id: number,
                public _id?: ObjectId) {
    }
}
