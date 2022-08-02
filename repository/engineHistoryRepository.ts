import { collections } from '../database.service';
import EngineHistoryModel from '../model/engineHistoryModel';
import PropertiesService from '../service/propertiesService';

export default class EngineHistoryRepository {

    /***
     * save engine history by model
     * @param engineHistoryModel
     */
    async saveEngineHistory(engineHistoryModel: EngineHistoryModel) {

        if (engineHistoryModel.status === 1) {
            await collections.engineHistoryModel?.insertOne(engineHistoryModel);
        } else {
            let query = { endDateTime: engineHistoryModel.endDateTime, status: 0  };
            let newRecord = { $set: query };
            await collections.engineHistoryModel.updateOne({ status: 1 }, newRecord);
        }

    }
}
