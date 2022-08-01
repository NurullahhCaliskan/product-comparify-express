"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productUploader_1 = __importDefault(require("./productUploader"));
const mail_service_1 = require("../mail.service");
const mailHistoryModel_1 = __importDefault(require("../model/mailHistoryModel"));
const mailHistoryService_1 = __importDefault(require("../service/mailHistoryService"));
const storeService_1 = __importDefault(require("../service/storeService"));
class MailService {
    async sendMail(storeModel) {
        try {
            let productUploader = new productUploader_1.default();
            // @ts-ignore
            let mailTemplate = productUploader.getMailResult(storeModel.cachedAlarm);
            // @ts-ignore
            let info = await mail_service_1.mailService.service.sendMail({
                from: '"Product Comparify 👻"' + process.env.MAILNAME,
                to: storeModel.selectedMail,
                subject: "Product Comparify Alarm System✔",
                text: "Hi, Here is products. Thank you",
                html: mailTemplate, // html body
            });
            let mailHistoryModel = new mailHistoryModel_1.default(storeModel.id, new Date, mailTemplate, 1, info, storeModel.cachedAlarm);
            let mailHistoryService = new mailHistoryService_1.default();
            await mailHistoryService.saveMailHistory(mailHistoryModel);
        }
        catch (e) {
            console.log(e);
        }
    }
    async sendTestMail(storeId) {
        let productUploader = new productUploader_1.default();
        let storeService = new storeService_1.default();
        let storeModel = await storeService.getStoreByStoreId(storeId);
        if (!storeModel) {
            console.log("user mode yok");
            return;
        }
        let mockData = [
            { website: "https://www.pipsnacks.com", url: "https://www.pipsnacks.com/collections/all-products/products/truffle-mini-heirloom-popcorn", newValue: "10$", oldValue: "5$", priceChangeRate: "100", productTitle: "Sea Salt Mini Popcorn ", src: "https://cdn.shopify.com/s/files/1/0162/2468/products/truffle-mini-popcorn-popcorn-pipsnacks-llc-429842.png?v=1651609752" },
            { website: "https://www.pipsnacks.com", url: "https://www.pipsnacks.com/collections/all-products/products/sea-salt-mini-heirloom-popcorn", newValue: "15$", oldValue: "5$", priceChangeRate: "200", productTitle: "Truffle Mini Popcorn", src: "https://cdn.shopify.com/s/files/1/0162/2468/products/sea-salt-mini-popcorn-popcorn-pipsnacks-llc-453933_large.png?v=1652110676" }
        ];
        // @ts-ignore
        storeModel.cachedAlarm = mockData;
        await this.sendMail(storeModel);
    }
}
exports.default = MailService;
