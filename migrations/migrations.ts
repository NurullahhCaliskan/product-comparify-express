import { collections } from '../database.service';

export async function createIndex() {
    await collections.productPriceHistoryTodayModel?.createIndex({ 'id': 1, 'website': 1 });
    await collections.productPriceHistoryYesterdayModel?.createIndex({ 'id': 1, 'website': 1 });

}
