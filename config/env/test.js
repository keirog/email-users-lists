'use strict';

const port = process.env.PORT || 1338;
const logLevel = process.env.LOG_LEVEL || 'warn';
const processId = process.env.DYNO || process.pid;
const db = process.env.MONGOLAB_URI || 'mongodb://localhost/ft-email-users-lists-test';
const authUser = process.env.BASIC_AUTH_USER || 'test';
const authPassword = process.env.BASIC_AUTH_PASSWORD || 'test';
const unsubscribeSecret = process.env.UNSUBSCRIBE_SECRET || 'test';

module.exports = { port, db, processId, logLevel, authUser, authPassword, unsubscribeSecret };