'use strict';

const port = process.env.PORT || 1338;
const logLevel = process.env.LOG_LEVEL || 'warn';
const processId = process.env.DYNO || process.pid;


module.exports = {
    port: port,
    processId: processId,
    logLevel: logLevel
};