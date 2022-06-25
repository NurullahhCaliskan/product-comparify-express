import * as mongoDB from "mongodb";

export let collections: {
    storeWebsitesRelationModel?: mongoDB.Collection,
    websitesModel?: mongoDB.Collection,
    productHistoryModel?: mongoDB.Collection,
    storeModel?: mongoDB.Collection,
    userSessionModel?: mongoDB.Collection,
    mailHistoryModel?: mongoDB.Collection,
    engineHistoryModel?: mongoDB.Collection
    productPriceHistoryModel?: mongoDB.Collection
    productHistoryCrawlerQueueModel?: mongoDB.Collection
    enginePermissionModel?: mongoDB.Collection
} = {}
