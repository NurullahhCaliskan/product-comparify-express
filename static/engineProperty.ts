export let startDate: Date = new Date();
export let endDate: Date = new Date();

/***
 * set Start date to engine
 */
export function setEngineStartDate() {
    startDate = new Date();
}

/***
 * set End date to engine
 */
export function setEngineEndDate() {
    endDate = new Date();
}
