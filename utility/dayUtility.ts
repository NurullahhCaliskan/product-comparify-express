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
