import {ObjectId} from "mongodb";

export default class ProductHistoryModel {
    constructor(public id: number,
                public website: string,
                public created_date_time: Date,
                public collection: string[],
                public url: string,
                public title: string,
                public handle: string,
                public published_at: Date,
                public created_at: Date,
                public updated_at: Date,
                public vendor: string,
                public product_type: string,
                public tags: string[],
                public variants: object[],
                public images: object[],
                public options: object[],
                public search: string,
                public _id?: ObjectId) {
    }
}
