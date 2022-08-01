import _ from "lodash";


export function arrayIsEmpty(list: object[]) {
    return !list || list.length === 0;

}

export function divideChunks(data:object[], divide:number):object[][]{
    return _.chunk(data, Math.ceil(data.length / divide))
}
