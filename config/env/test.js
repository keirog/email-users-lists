'use strict';

const port = process.env.PORT || 1338;
const logLevel = process.env.LOG_LEVEL || 'warn';
const processId = process.env.DYNO || process.pid;
const db = 'mongodb://localhost/ft-email-users-lists-test';
const authUser = process.env.BASIC_AUTH_USER || 'test';
const authPassword = process.env.BASIC_AUTH_PASSWORD || 'test';
const unsubscribeSecret = process.env.UNSUBSCRIBE_SECRET || 'test';
const emailSigningKey = process.env.EMAIL_SIGNING_KEY || 'test';
const encryptionKey = process.env.ENCRYPTION_KEY || 'daf46e294fb86bb0cdeb2b1e4ff6c8d8';
const hmacKey = process.env.HMAC_KEY || '4746ea10cbba25f6f68482112219fb3d961a502215134eb5fb4bf5fea7a4422c';

module.exports = { port, db, processId, logLevel, authUser, authPassword, unsubscribeSecret, encryptionKey, hmacKey, emailSigningKey };
