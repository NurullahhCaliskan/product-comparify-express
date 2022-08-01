import { ObjectId } from 'mongodb';

export default class PropertiesModel {
    constructor(public text: string,  public value: number, public id?: ObjectId) {
    }
}
