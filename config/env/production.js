'use strict';

const port = process.env.PORT;
const logLevel = process.env.LOG_LEVEL || 'error';
const processId = process.env.DYNO;
const db = process.env.MONGOHQ_URL;
const authUser = process.env.BASIC_AUTH_USER;
const authPassword = process.env.BASIC_AUTH_PASSWORD;
const unsubscribeSecret = process.env.UNSUBSCRIBE_SECRET;

module.exports = { port, db, processId, logLevel, authUser, authPassword, unsubscribeSecret };