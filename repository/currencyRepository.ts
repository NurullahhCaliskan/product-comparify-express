import { collections } from '../database.service';
import axios from 'axios';
import { logger } from '../utility/logUtility';

export default class CurrencyRepository {

    async saveCurrenciesByApi() {
        try {
            logger.info(__filename + 'saveCurrenciesByApi');

            let curArray: { key: string; value: unknown; }[] = [];

            let requestOptions = {
                method: 'GET',
                redirect: 'follow',
                headers: { 'apikey': process.env.APILAYER_API_KEY },
            };

            let response;
            // @ts-ignore
            response = await axios.get('https://api.apilayer.com/exchangerates_data/latest?base=usd', requestOptions);

            let data = response.data.rates;

            Object.entries(data).forEach(entry => {
                const [key, value] = entry;
                curArray.push({ key: key, value: value });
            });

            await collections.currency?.deleteMany({});
            await collections.currency?.insertMany(curArray);
            logger.info(__filename + 'successCur');
        } catch (e) {
            logger.error(__filename + 'fail cur' + e);
        }
    }

    async getAllCurrencies() {
        return await collections.currency?.find().toArray();
    }
}
