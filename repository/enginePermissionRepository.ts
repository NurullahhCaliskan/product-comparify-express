import { collections } from '../database.service';
import { getYesterdayMidnight } from '../utility/dayUtility';
import EnginePermissionModel from '../model/enginePermissionModel';

export default class EnginePermissionRepository {

    /**
     * available check
     */
    async isAvailableRunQueueEngine(): Promise<boolean> {

        let yesterdayMidnight = getYesterdayMidnight();

        let findJson = { $and: [{ collection: 'product-history-crawler-queue' }, { status: 1 }, { last_run_time: { $gte: yesterdayMidnight } }] };

        let response = await collections.enginePermissionModel?.find(findJson).toArray() as EnginePermissionModel[];

        return response.length <= 0;
    }

    /***
     * set available check
     */
    async setAvailableQueueEngine() {
        let query = { collection: 'product-history-crawler-queue' };
        let newRecord = { $set: { status: 0, last_run_time: new Date() } };
        // @ts-ignore
        await collections.enginePermissionModel.updateOne(query, newRecord);
    }

    async setUnavailableQueueEngine() {
        let query = { collection: 'product-history-crawler-queue' };
        let newRecord = { $set: { status: 1, last_run_time: new Date() } };
        // @ts-ignore
        await collections.enginePermissionModel.updateOne(query, newRecord);
    }


    /***
     * set unavailable check
     */
    async isAvailableRunMainEngine(): Promise<boolean> {
        let findJson = { $and: [{ collection: 'product-history-main' }, { status: 1 }] };

        let response = await collections.enginePermissionModel?.find(findJson).toArray() as EnginePermissionModel[];

        return response.length <= 0;
    }

    async setAvailableMainEngine() {
        let query = { collection: 'product-history-main' };
        let newRecord = { $set: { status: 0, last_run_time: new Date() } };
        // @ts-ignore
        await collections.enginePermissionModel.updateOne(query, newRecord);
    }

    async setUnavailableMainEngine() {
        let query = { collection: 'product-history-main' };
        let newRecord = { $set: { status: 1, last_run_time: new Date() } };
        // @ts-ignore
        await collections.enginePermissionModel.updateOne(query, newRecord);
    }
}
