"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.logError = exports.logRequest = void 0;
const winston_1 = require("winston");
const dayUtility_1 = require("./dayUtility");
require("winston-mongodb");
const { combine, timestamp, printf } = winston_1.format;
const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp}  ${level}: ${message}`;
});
// @ts-ignore
const mongoDbLog = new winston_1.transports.MongoDB({
    level: 'error',
    //mongo database connection link
    db: process.env.DBHOST,
    options: {
        useUnifiedTopology: true,
    },
    // A collection to save json formatted logs
    collection: 'server_logs_express',
    format: winston_1.format.combine(winston_1.format.timestamp(), 
    // Convert logs to a json format
    winston_1.format.json()),
});
// @ts-ignore
const myWinstonOptions = {
    format: combine(
    //label({ label: __filename }),
    timestamp(), myFormat),
    exitOnError: false,
    transports: process.env.NODE_ENV !== 'production' ? [
        new winston_1.transports.Console(),
        new winston_1.transports.File({ filename: __dirname + '/../../logs/exceptions/' + (0, dayUtility_1.formatDate)() + '.log', handleExceptions: true }),
        new winston_1.transports.File({ filename: __dirname + '/../../logs/' + (0, dayUtility_1.formatDate)() + '.log' }),
        mongoDbLog,
    ] : [
        new winston_1.transports.File({ filename: __dirname + '/../../logs/error/' + (0, dayUtility_1.formatDate)() + '.log', level: 'error' }),
        new winston_1.transports.File({ filename: __dirname + '/../../logs/' + (0, dayUtility_1.formatDate)() + '.log' }),
        mongoDbLog,
    ],
};
// @ts-ignore
function logRequest(req, res, next) {
    exports.logger.info(req.url);
    next();
}
exports.logRequest = logRequest;
// @ts-ignore
function logError(err, req, res, next) {
    exports.logger.error(err);
    next();
}
exports.logError = logError;
// @ts-ignore
exports.logger = new winston_1.createLogger(myWinstonOptions);
