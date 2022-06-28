import { ObjectId } from 'mongodb';

export default class EngineHistoryModel {
    constructor(public createDateTime: Date,
                public result: string,
                public _id?: ObjectId) {
    }
}
