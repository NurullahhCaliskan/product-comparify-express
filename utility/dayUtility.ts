export function  getYesterdayMidnight():Date {
        let date = new Date();
        date.setDate(date.getDate() - 1);
        date.setHours(0, 0, 0, 0)

        return date;
    }

export function  getTodayMidnight():Date {
    let date = new Date();
    date.setHours(0, 0, 0, 0)

    return date;
}
