import UserModel from "../model/userModel";
import ProductUploader from "./productUploader";
import {mailService} from "../mail.service";
import MailHistoryModel from "../model/mailHistoryModel";
import MailHistoryService from "../service/mailHistoryService";
import UserService from "../service/userService";

export default class MailService {

    async sendMail(userModel: UserModel) {
        try {


            let productUploader = new ProductUploader()
            // @ts-ignore
            let mailTemplate = productUploader.getMailResult(userModel.cachedAlarm)

            // @ts-ignore
            let info = await mailService.service.sendMail({
                from: '"Product Comparify 👻"' + process.env.MAILNAME, // sender address
                to: userModel.mail, // list of receivers
                subject: "Product Comparify Alarm System✔", // Subject line
                text: "Hi, Here is products. Thank you", // plain text body
                html: mailTemplate, // html body
            });


            let mailHistoryModel = new MailHistoryModel(userModel.userId, new Date, mailTemplate, 1, info, userModel.cachedAlarm);

            let mailHistoryService = new MailHistoryService();
            await mailHistoryService.saveMailHistory(mailHistoryModel);
        } catch (e) {
            console.log(e)
        }
    }

    async sendTestMail(userid: string) {
        let productUploader = new ProductUploader()
        let userService = new UserService()
        let userModel = await userService.getUserByUserId(userid)

        if (!userModel) {
            console.log("user mode yok")
            return;
        }

        let mockData = [
            {website: "https://www.pipsnacks.com", url: "https://www.pipsnacks.com/collections/all-products/products/truffle-mini-heirloom-popcorn", newValue: "10$", oldValue: "5$", priceChangeRate: "100", productTitle: "Sea Salt Mini Popcorn ", src: "https://cdn.shopify.com/s/files/1/0162/2468/products/truffle-mini-popcorn-popcorn-pipsnacks-llc-429842.png?v=1651609752"},
            {website: "https://www.pipsnacks.com", url: "https://www.pipsnacks.com/collections/all-products/products/sea-salt-mini-heirloom-popcorn", newValue: "15$", oldValue: "5$", priceChangeRate: "200", productTitle: "Truffle Mini Popcorn", src: "https://cdn.shopify.com/s/files/1/0162/2468/products/sea-salt-mini-popcorn-popcorn-pipsnacks-llc-453933_large.png?v=1652110676"}
        ]

        // @ts-ignore
        userModel.cachedAlarm = mockData;

        await this.sendMail(userModel);
    }
}
