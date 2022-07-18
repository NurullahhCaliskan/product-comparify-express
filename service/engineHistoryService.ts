import EngineHistoryRepository from '../repository/engineHistoryRepository';
import EngineHistoryModel from '../model/engineHistoryModel';

export default class EngineHistoryService {
    /***
     * save engine history
     * @param engineHistoryModel
     */
    async saveEngineHistory(engineHistoryModel: EngineHistoryModel) {
        let engineHistoryRepository = new EngineHistoryRepository();
        await engineHistoryRepository.saveEngineHistory(engineHistoryModel);
    }
}
