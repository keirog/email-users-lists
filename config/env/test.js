const config = exports;

function int(str) {
  if (str) {
    return 0;
  }
  return parseInt(str, 10);
}

config.port = process.env.PORT || 1338;
config.logLevel = process.env.LOG_LEVEL || 'warn';
config.processId = process.env.DYNO || process.pid;
config.db = 'mongodb://localhost/ft-email-users-lists-test';
config.authUser = process.env.BASIC_AUTH_USER || 'test';
config.authPassword = process.env.BASIC_AUTH_PASSWORD || 'test';
config.unsubscribeSecret = process.env.UNSUBSCRIBE_SECRET || 'test';
config.emailSigningKey = '263c7a97a21976ceb80500028e31c6e2';
config.emailBlindIdxSigningKey = 'db44fefcac1cb18674c60c180650c53c3e35d6df838b3322df57e94b0201d74a';
config.rabbitUrl = process.env.CLOUDAMQP_URL || 'amqp://localhost';
config.updateQueue = process.env.UPDATE_QUEUE || 'user.lists.updates.test';
config.queuePrefetch = int(process.env.QUEUE_PREFETCH) || 1;
