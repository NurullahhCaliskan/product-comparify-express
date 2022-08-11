import { ObjectId } from 'mongodb';

export default class ProductPriceHistoryWithCompareModel {
    constructor(public today_id: number,
                public today_website: string,
                public today_currency: string,
                public today_created_date_time: Date,
                public today_timestamp_id: number,
                public today_variant: object,

                public yesterday_id: number,
                public yesterday_website: string,
                public yesterday_currency: string,
                public yesterday_created_date_time: Date,
                public yesterday_timestamp_id: number,
                public yesterday_variant: object,
                public _id?: ObjectId) {
    }
}
