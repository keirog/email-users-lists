'use strict';

const port = process.env.PORT || 1337;
const logLevel = process.env.LOG_LEVEL || 'info';
const processId = process.env.DYNO || process.pid;
const db = process.env.MONGOLAB_URI || 'mongodb://localhost/ft-email-users-lists-dev';
const authUser = process.env.BASIC_AUTH_USER || 'development';
const authPassword = process.env.BASIC_AUTH_PASSWORD || 'development';

module.exports = {
    port: port,
    db: db,
    processId: processId,
    logLevel: logLevel,
    authUser: authUser,
    authPassword: authPassword
};