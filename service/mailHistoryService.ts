import MailHistoryModel from '../model/mailHistoryModel';
import MailHistoryRepository from '../repository/mailHistoryRepository';

export default class MailHistoryService {
    /***
     * save mail history by url
     * @param mailHistoryModel
     */
    async saveMailHistory(mailHistoryModel: MailHistoryModel) {
        let mailHistoryRepository = new MailHistoryRepository();
        await mailHistoryRepository.saveMailHistory(mailHistoryModel);
    }
}
