import { ObjectId } from 'mongodb';

export default class EngineHistoryModel {
    constructor(public createDateTime: Date,
                public endDateTime: Date,
                public status: number,
                public _id?: ObjectId) {
    }
}
