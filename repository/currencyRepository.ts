import { collections } from '../database.service';
import axios from 'axios';

export default class CurrencyRepository {

    async saveCurrenciesByApi() {
        try {
            console.log('saveCurrenciesByApi');

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
            console.log('successCur');
        } catch (e) {
            console.log(e);
            console.log('failCur');
        }
    }

    async getAllCurrencies() {
        return await collections.currency?.find().toArray();
    }
}
