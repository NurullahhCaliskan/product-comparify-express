import {ObjectId} from "mongodb";

export default class StoreModel {
    constructor(public id: number,
                public selectedMail?: string,
                public alarm?: [{ website: string, alarm: number, value: number }],
                public cachedAlarm?: [{ website: string, url: string, newValue: number, oldValue: number, priceChangeRate: number, productTitle: string, src: string, currency:string }],
                public _id?: ObjectId) {
    }
}
