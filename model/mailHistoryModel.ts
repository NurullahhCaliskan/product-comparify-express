import { ObjectId } from 'mongodb';

export default class MailHistoryModel {
    constructor(public storeId: number,
                public createDateTime: Date,
                public mailBody: string,
                public status: number,
                public result: object,
                public cachedAlarm?: [{ website: string, url: string, newValue: number, oldValue: number, priceChangeRate: number, productTitle: string, src: string }],
                public _id?: ObjectId) {
    }
}
