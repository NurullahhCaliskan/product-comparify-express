import MailHistoryModel from "../model/mailHistoryModel";
import {collections} from "../database.service";

export default class MailHistoryRepository {

    /***
     * save mail history by url
     * @param mailHistoryModel
     */
    async saveMailHistory(mailHistoryModel: MailHistoryModel) {

        await collections.mailHistoryModel?.insertOne(mailHistoryModel);
    }
}
