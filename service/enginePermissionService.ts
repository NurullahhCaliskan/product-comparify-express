import EnginePermissionRepository from '../repository/enginePermissionRepository';

export default class EnginePermissionService {

    /**
     * available check
     */
    async isAvailableRunQueueEngine(): Promise<boolean> {
        let enginePermissionRepository = new EnginePermissionRepository();
        return await enginePermissionRepository.isAvailableRunQueueEngine();
    }

    /***
     * set available check
     */
    async setAvailableQueueEngine() {
        let enginePermissionRepository = new EnginePermissionRepository();
        await enginePermissionRepository.setAvailableQueueEngine();
    }

    /***
     * set unavailable check
     */
    async setUnavailableQueueEngine() {
        let enginePermissionRepository = new EnginePermissionRepository();
        await enginePermissionRepository.setUnavailableQueueEngine();
    }


    /***
     * save mail history by url
     * @param mailHistoryModel
     */
    async isAvailableRunMainEngine(): Promise<boolean> {
        let enginePermissionRepository = new EnginePermissionRepository();
        return await enginePermissionRepository.isAvailableRunMainEngine();
    }

    async setAvailableMainEngine() {
        let enginePermissionRepository = new EnginePermissionRepository();
        await enginePermissionRepository.setAvailableMainEngine();
    }

    async setUnavailableMainEngine() {
        let enginePermissionRepository = new EnginePermissionRepository();
        await enginePermissionRepository.setUnavailableMainEngine();
    }
}
