import {ObjectId} from "mongodb";

export default class StoreWebsitesRelationModel {
    constructor(public storeId: number, public website: string, public alarm: number, public value: number, public id?: ObjectId) {
    }
}
