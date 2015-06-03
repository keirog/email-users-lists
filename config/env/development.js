'use strict';

const port = process.env.PORT || 1337;
const logLevel = process.env.LOG_LEVEL || 'info';
const processId = process.env.DYNO || process.pid;


module.exports = {
    port: port,
    processId: processId,
    logLevel: logLevel
};