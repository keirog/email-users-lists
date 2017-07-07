'use strict';

const port = process.env.PORT || 1338;
const logLevel = process.env.LOG_LEVEL || 'warn';
const processId = process.env.DYNO || process.pid;
const db = 'mongodb://localhost/ft-email-users-lists-test';
const authUser = process.env.BASIC_AUTH_USER || 'test';
const authPassword = process.env.BASIC_AUTH_PASSWORD || 'test';
const unsubscribeSecret = process.env.UNSUBSCRIBE_SECRET || 'test';
const emailSigningKey = '263c7a97a21976ceb80500028e31c6e2';
const emailBlindIdxSigningKey = 'db44fefcac1cb18674c60c180650c53c3e35d6df838b3322df57e94b0201d74a';

module.exports = {
  port,
  db,
  processId,
  logLevel,
  authUser,
  authPassword,
  unsubscribeSecret,
  emailSigningKey,
  emailBlindIdxSigningKey
};
