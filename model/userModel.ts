import {ObjectId} from "mongodb";

export default class UserModel {
    constructor(public userId: string,
                public alarm?: [{ website: string, alarm: number, value: number }],
                public cachedAlarm?: [{ website: string, url: string, newValue: number, oldValue: number, priceChangeRate: number, productTitle: string }]) {
    }
}
