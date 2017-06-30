'use strict';

const port = process.env.PORT;
const logLevel = process.env.LOG_LEVEL || 'error';
const processId = process.env.DYNO;
const db = process.env.MONGOHQ_URL;
const authUser = process.env.BASIC_AUTH_USER;
const authPassword = process.env.BASIC_AUTH_PASSWORD;
const unsubscribeSecret = process.env.UNSUBSCRIBE_SECRET;
const sentryDSN = process.env.SENTRY_DSN;
const encryptionKey = process.env.ENCRYPTION_KEY;
const hmacKey = process.env.HMAC_KEY;
const emailSigningKey = process.env.EMAIL_SIGNING_KEY;

module.exports = { port, db, processId, logLevel, authUser, authPassword, unsubscribeSecret, sentryDSN, encryptionKey, hmacKey, emailSigningKey };
