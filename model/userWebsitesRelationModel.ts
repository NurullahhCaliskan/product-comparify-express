import {ObjectId} from "mongodb";

export default class UserWebsitesRelationModel {
    constructor(public userId: string, public website: string, public alarm: number, public value: number, public id?: ObjectId) {
    }
}
