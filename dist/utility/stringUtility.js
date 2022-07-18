"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBlankString = exports.urlFormatter = void 0;
function urlFormatter(value) {
    if (isBlankString(value)) {
        return value;
    }
    let formattedValue = value.replace(/\s/g, '');
    formattedValue = formattedValue.replace(/([^:]\/)\/+/g, '$1');
    let lastLetter = formattedValue.charAt(formattedValue.length - 1);
    if (lastLetter === '/') {
        formattedValue = formattedValue.substring(0, formattedValue.length - 1);
    }
    return formattedValue;
}
exports.urlFormatter = urlFormatter;
function isBlankString(value) {
    return (!value || value.length === 0);
}
exports.isBlankString = isBlankString;
