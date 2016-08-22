'use strict';

export default class Logger {

    static log(msg) {
        console.log(msg);
    }

    static warn(msg) {
        if (console.warn) {
            console.warn(msg);
        } else {
            console.log('WARNING: ' + msg);
        }
    }

    static error(msg) {
        if (console.error) {
            console.error(msg);
        } else {
            console.log('ERROR: ' + msg);
        }
    }
}
