'use strict';

const port = process.env.PORT;
const logLevel = process.env.LOG_LEVEL || 'error';
const processId = process.env.DYNO;
const db = process.env.MONGOHQ_URL;
const authUser = process.env.BASIC_AUTH_USER;
const authPassword = process.env.BASIC_AUTH_PASSWORD;
const unsubscribeSecret = process.env.UNSUBSCRIBE_SECRET;
const sentryDSN = process.env.SENTRY_DSN;
const emailSigningKey = process.env.EMAIL_SIGNING_KEY;
const emailBlindIdxSigningKey = process.env.EMAIL_BLIND_IDX_SIGNING_KEY;

module.exports = {
  port,
  db,
  processId,
  logLevel,
  authUser,
  authPassword,
  unsubscribeSecret,
  sentryDSN,
  emailSigningKey,
  emailBlindIdxSigningKey
};
