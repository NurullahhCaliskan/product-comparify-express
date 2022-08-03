import { collections } from '../database.service';
import EngineHistoryModel from '../model/engineHistoryModel';

export default class EngineHistoryRepository {

    /***
     * save engine history by model
     * 0 is set finish, 1 is set start, 2 is set half start
     * @param engineHistoryModel
     */
    async saveEngineHistory(engineHistoryModel: EngineHistoryModel) {

        if (engineHistoryModel.status === 1) {
            await collections.engineHistoryModel?.insertOne(engineHistoryModel);
        } else if (engineHistoryModel.status === 2)  {
            let query = { firstDateTime: engineHistoryModel.firstDateTime, status: 2  };
            let newRecord = { $set: query };
            await collections.engineHistoryModel.updateOne({ status: 1 }, newRecord);
        }else{
            let query = { endDateTime: engineHistoryModel.endDateTime, status: 0  };
            let newRecord = { $set: query };
            await collections.engineHistoryModel.updateOne({ status: 2 }, newRecord);
        }
    }
}
