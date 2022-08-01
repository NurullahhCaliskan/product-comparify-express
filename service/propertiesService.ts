import PropertiesModel from '../model/propertiesModel';
import PropertiesRepository from '../repository/propertiesRepository';

export default class PropertiesService {

    async getPropertiesByText(text: string): Promise<PropertiesModel> {
        let propertiesRepository = new PropertiesRepository();
        return await propertiesRepository.getPropertiesByText(text);
    }

}
