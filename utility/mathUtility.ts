export function rateAsPercentage(partialValue: number, totalValue: number) {
    let result = 0
    try {
        result =  ((100 * partialValue) / totalValue) - 100;
    } catch (e) {

    }
    return result;
}

export function rate(partialValue: number, totalValue: number) {
    let result = 0
    try {
        result = (partialValue) / totalValue;
    } catch (e) {

    }
    return result;
}
