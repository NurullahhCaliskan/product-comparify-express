import * as mongoDB from "mongodb";

export let collections: {
    userWebsitesRelationModel?: mongoDB.Collection,
    websitesModel?: mongoDB.Collection,
    productHistoryModel?: mongoDB.Collection,
    userModel?: mongoDB.Collection,
    userSessionModel?: mongoDB.Collection,
    mailHistoryModel?: mongoDB.Collection,
    engineHistoryModel?: mongoDB.Collection
    productPriceHistoryModel?: mongoDB.Collection
} = {}
