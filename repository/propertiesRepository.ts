import { collections } from '../database.service';
import ProductPriceHistoryModel from '../model/productPriceHistoryModel';
import PropertiesModel from '../model/propertiesModel';

export default class PropertiesRepository {

    async getPropertiesByText(text: string): Promise<PropertiesModel> {
        // @ts-ignore
        return await collections.properties?.findOne({ text: text }) as PropertiesModel;
    }
}
