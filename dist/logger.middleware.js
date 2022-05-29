"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const getProcessingTimeInMS = (time) => {
    return `${(time[0] * 1000 + time[1] / 1e6).toFixed(2)}ms`;
};
/**
 * add logs for an API endpoint using the following pattern
 *  [id][timestamp] method:url START processing
 *  [id][timestamp] method:url response.statusCode END processing
 *
 * @param req Express.Request
 * @param res Express.Response
 * @param next Express.NextFunction
 */
function logger(req, res, next) {
    console.log('logger');
    // generate unique identifier
    const id = (0, uuid_1.v4)();
    // get timestamp
    const now = new Date();
    const timestamp = [
        now.getMonth() + 1,
        '-',
        now.getDate(),
        '-',
        now.getFullYear(),
        ' ',
        now.getHours(),
        ':',
        now.getMinutes(),
        ':',
        now.getSeconds()
    ].join('');
    // get api endpoint
    const { method, url } = req;
    // log start of the execution process
    const start = process.hrtime();
    const startText = `START:${getProcessingTimeInMS(start)}`;
    const idText = `[${id}]`;
    const timeStampText = `[${timestamp}]`;
    console.log(`${idText}${timeStampText} ${method}:${url} ${startText}`);
    // trigger once a response is sent to the client
    res.once('finish', () => {
        // log end of the execution process
        const end = process.hrtime(start);
        const endText = `END:${getProcessingTimeInMS(end)}`;
        console.log(`${idText}${timeStampText} ${method}:${url} ${res.statusCode} ${endText}`);
    });
    // execute next middleware/event handler
    next();
}
;
exports.default = logger;
