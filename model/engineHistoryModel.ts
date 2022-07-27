import { ObjectId } from 'mongodb';

export default class EngineHistoryModel {
    constructor(public createDateTime: Date,
                public endDateTime: Date,
                public _id?: ObjectId) {
    }
}
