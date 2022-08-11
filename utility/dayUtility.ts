import moment from 'moment';

export function getYesterdayMidnight(): Date {
    let date = new Date();
    date.setDate(date.getDate() - 1);
    date.setUTCHours(0, 0, 0, 0);

    return date;
}

export function getTodayMidnight(): Date {
    let date = new Date();
    date.setUTCHours(0, 0, 0, 0);

    return date;
}

export function getTomorrowMidnight(): Date {
    let date = new Date();
    date.setDate(date.getDate() + 1);
    date.setUTCHours(0, 0, 0, 0);

    return date;
}

export function formatDate() {
    let d = new Date();


    return [d.getFullYear(), d.getMonth(), d.getDay()].join('-');
}

export function getTodayAsNumber() {
    return parseInt(moment().subtract(process.env.CRAWL_MINUS_TODAY, 'days').format('YYYYMMDD'));
}

export function getYesterdayAsNumber() {
    // @ts-ignore
    return parseInt(moment().subtract(process.env.CRAWL_MINUS_TODAY + 1, 'days').format('YYYYMMDD'));
}
