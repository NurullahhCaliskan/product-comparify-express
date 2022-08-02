import { collections } from '../database.service';

// @ts-ignore
export let currencyList : [{key:string,value:number}] = collections.currency?.find().toArray();
