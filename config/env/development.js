'use strict';

const port = process.env.PORT || 1337;
const logLevel = process.env.LOG_LEVEL || 'info';
const processId = process.env.DYNO || process.pid;
const db = 'mongodb://localhost/ft-email-users-lists-dev';
const authUser = process.env.BASIC_AUTH_USER || 'development';
const authPassword = process.env.BASIC_AUTH_PASSWORD || 'development';
const unsubscribeSecret = process.env.UNSUBSCRIBE_SECRET || 'developmentSecret';
const sentryDSN = process.env.SENTRY_DSN;
const emailSigningKey = process.env.EMAIL_SIGNING_KEY || '263c7a97a21976ceb80500028e31c6e2';
const emailBlindIdxSigningKey = process.env.EMAIL_BLIND_IDX_SIGNING_KEY || 'db44fefcac1cb18674c60c180650c53c3e35d6df838b3322df57e94b0201d74a';

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
