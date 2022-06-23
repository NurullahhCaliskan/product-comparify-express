import MailHistoryModel from "../model/mailHistoryModel";
import MailHistoryRepository from "../repository/mailHistoryRepository";
import EnginePermissionRepository from "../repository/enginePermissionRepository";

export default class EnginePermissionService {
    /***
     * save mail history by url
     * @param mailHistoryModel
     */
    async isAvailableRunQueueEngine(): Promise<boolean> {
        let enginePermissionRepository = new EnginePermissionRepository()
        return await enginePermissionRepository.isAvailableRunQueueEngine();
    }

    async setAvailableQueueEngine(){
        let enginePermissionRepository = new EnginePermissionRepository()
        await enginePermissionRepository.setAvailableQueueEngine()
    }

    async setUnavailableQueueEngine(){
        let enginePermissionRepository = new EnginePermissionRepository()
        await enginePermissionRepository.setUnavailableQueueEngine()
    }
}
