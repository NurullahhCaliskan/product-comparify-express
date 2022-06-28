import EngineHistoryRepository from '../repository/engineHistoryRepository';
import EngineHistoryModel from '../model/engineHistoryModel';

export default class EngineHistoryService {
    /***
     * save mail history by url
     * @param engineHistoryModel
     */
    async saveEngineHistory(engineHistoryModel: EngineHistoryModel) {
        let engineHistoryRepository = new EngineHistoryRepository();
        await engineHistoryRepository.saveEngineHistory(engineHistoryModel);
    }
}
