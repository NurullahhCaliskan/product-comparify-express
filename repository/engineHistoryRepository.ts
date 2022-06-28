import { collections } from '../database.service';
import EngineHistoryModel from '../model/engineHistoryModel';

export default class EngineHistoryRepository {

    /***
     * save engine history by model
     * @param engineHistoryModel
     */
    async saveEngineHistory(engineHistoryModel: EngineHistoryModel) {

        await collections.engineHistoryModel?.insertOne(engineHistoryModel);
    }
}
