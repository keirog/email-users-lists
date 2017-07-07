'use strict';

const port = process.env.PORT || 1337;
const logLevel = process.env.LOG_LEVEL || 'info';
const processId = process.env.DYNO || process.pid;
const db = 'mongodb://localhost/app49936913';
const authUser = process.env.BASIC_AUTH_USER || 'development';
const authPassword = process.env.BASIC_AUTH_PASSWORD || 'development';
const unsubscribeSecret = process.env.UNSUBSCRIBE_SECRET || 'developmentSecret';
const sentryDSN = process.env.SENTRY_DSN;
const encryptionKey = process.env.ENCRYPTION_KEY || 'daf46e294fb86bb0cdeb2b1e4ff6c8d8';
const hmacKey = process.env.HMAC_KEY || '4746ea10cbba25f6f68482112219fb3d961a502215134eb5fb4bf5fea7a4422c';
const emailSigningKey = process.env.EMAIL_SIGNING_KEY || 'development';

module.exports = { port, db, processId, logLevel, authUser, authPassword, unsubscribeSecret, sentryDSN, encryptionKey, hmacKey, emailSigningKey };
