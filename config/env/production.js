'use strict';

const port = process.env.PORT;
const logLevel = process.env.LOG_LEVEL || 'error';
const processId = process.env.DYNO;
const db = process.env.MONGOLAB_URI;
const authUser = process.env.BASIC_AUTH_USER;
const authPassword = process.env.BASIC_AUTH_PASSWORD;
const unsubscribeSecret = process.env.UNSUBSCRIBE_SECRET;
const newrelicKey = process.env.NEW_RELIC_LICENSE_KEY;

module.exports = {
    port: port,
    db: db,
    processId: processId,
    logLevel: logLevel,
    authUser: authUser,
    authPassword: authPassword,
    unsubscribeSecret: unsubscribeSecret,
    newrelicKey: newrelicKey
};