import { ObjectId } from 'mongodb';

export default class ProductMailHistoryModel {
    constructor(public storeId: number,
                public website: string,
                public url: string,
                public newValue: number,
                public oldValue: number,
                public priceChangeRate: number,
                public productTitle: string,
                public imageSrc: string,
                public currency: string,
                public createDateTime: Date,
                public mail?: string,
                public newValueAsUsd?: number,
                public oldValueAsUsd?: number,
                public _id?: ObjectId) {
    }
}
