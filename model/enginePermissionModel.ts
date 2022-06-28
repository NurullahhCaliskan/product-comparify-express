import { ObjectId } from 'mongodb';

export default class EnginePermissionModel {
    constructor(public collection: string,
                public status: number,
                public last_run_time: Date,
                public info: string,
                public _id?: ObjectId) {
    }
}
