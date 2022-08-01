import * as mongoDB from "mongodb";
import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

// @ts-ignore
const client  = new mongoDB.MongoClient(process.env.DBHOST);

client.connect().then(r=>r);

const db = client.db(process.env.DBNAME);


export let collections = {
    storeWebsitesRelationModel : db.collection("store-websites-relation"),
    websitesModel : db.collection("websites"),
    productHistoryModel : db.collection("product-history"),
    storeModel : db.collection("store"),
    userSessionModel : db.collection("user-session"),
    mailHistoryModel : db.collection("mail-history"),
    engineHistoryModel : db.collection("engine-history"),
    productPriceHistoryModel : db.collection("product-price-history"),
    productHistoryCrawlerQueueModel : db.collection("product-history-crawler-queue"),
    enginePermissionModel : db.collection("engine-permission"),
    productMailHistoryModel : db.collection("product-mail-history"),
    currency : db.collection("currency"),
    properties : db.collection("properties"),

};





