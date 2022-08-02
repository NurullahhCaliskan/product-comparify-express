import { ObjectId } from 'mongodb';

export default class EngineHistoryModel {
    constructor(public createDateTime: Date,
                public endDateTime: Date,
                public status: number,
                public threadCount: number,
                public _id?: ObjectId) {
    }
}
