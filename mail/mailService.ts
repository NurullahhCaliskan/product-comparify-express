import ProductUploader from './productUploader';
import { mailService } from '../mail.service';
import MailHistoryModel from '../model/mailHistoryModel';
import MailHistoryService from '../service/mailHistoryService';
import StoreModel from '../model/storeModel';
import StoreService from '../service/storeService';
import { logger } from '../utility/logUtility';

export default class MailService {

    async sendMail(storeModel: StoreModel) {
        try {


            let productUploader = new ProductUploader();
            // @ts-ignore
            let mailTemplate = productUploader.getMailResult(storeModel.cachedAlarm);

            // @ts-ignore
            let info = await mailService.service.sendMail({
                from: '"Product Comparify 👻"' + process.env.MAILNAME, // sender address
                to: storeModel.selectedMail, // list of receivers
                subject: "Product Comparify Alarm System✔", // Subject line
                text: "Hi, Here is products. Thank you", // plain text body
                html: mailTemplate, // html body
            });


            let mailHistoryModel = new MailHistoryModel(storeModel.id, new Date, mailTemplate, 1, info, storeModel.cachedAlarm);

            let mailHistoryService = new MailHistoryService();
            await mailHistoryService.saveMailHistory(mailHistoryModel);
        } catch (e) {
            logger.error(__filename + e);
        }
    }

    async sendTestMail(storeId: number) {
        let productUploader = new ProductUploader()
        let storeService = new StoreService()
        let storeModel = await storeService.getStoreByStoreId(storeId)

        if (!storeModel) {
            return;
        }

        let mockData = [
            {website: "https://www.pipsnacks.com", url: "https://www.pipsnacks.com/collections/all-products/products/truffle-mini-heirloom-popcorn", newValue: "10$", oldValue: "5$", priceChangeRate: "100", productTitle: "Sea Salt Mini Popcorn ", src: "https://cdn.shopify.com/s/files/1/0162/2468/products/truffle-mini-popcorn-popcorn-pipsnacks-llc-429842.png?v=1651609752"},
            {website: "https://www.pipsnacks.com", url: "https://www.pipsnacks.com/collections/all-products/products/sea-salt-mini-heirloom-popcorn", newValue: "15$", oldValue: "5$", priceChangeRate: "200", productTitle: "Truffle Mini Popcorn", src: "https://cdn.shopify.com/s/files/1/0162/2468/products/sea-salt-mini-popcorn-popcorn-pipsnacks-llc-453933_large.png?v=1652110676"}
        ]

        // @ts-ignore
        storeModel.cachedAlarm = mockData;

        await this.sendMail(storeModel);
    }
}
