const config = exports;

function int(str) {
  if (str) {
    return 0;
  }
  return parseInt(str, 10);
}

config.port = process.env.PORT || 1337;
config.logLevel = process.env.LOG_LEVEL || 'info';
config.processId = process.env.DYNO || process.pid;
config.db = 'mongodb://localhost/ft-email-users-lists-dev';
config.authUser = process.env.BASIC_AUTH_USER || 'development';
config.authPassword = process.env.BASIC_AUTH_PASSWORD || 'development';
config.unsubscribeSecret = process.env.UNSUBSCRIBE_SECRET || 'developmentSecret';
config.sentryDSN = process.env.SENTRY_DSN;
config.emailSigningKey = process.env.EMAIL_SIGNING_KEY || '263c7a97a21976ceb80500028e31c6e2';
config.emailBlindIdxSigningKey = process.env.EMAIL_BLIND_IDX_SIGNING_KEY || 'db44fefcac1cb18674c60c180650c53c3e35d6df838b3322df57e94b0201d74a';
config.rabbitUrl = process.env.CLOUDAMQP_URL || 'amqp://localhost';
config.updateExchange = process.env.UPDATE_EXCHANGE || 'user.lists.exchange.dev';
config.updateQueue = process.env.UPDATE_QUEUE || 'user.lists.updates.dev';
config.deadLetterQueue = process.env.DEAD_LETTER_QUEUE || 'user.lists.dletter.dev';
config.deadLetterTTL = int(process.env.DEAD_LETTER_TTL) || 3000;
config.queuePrefetch = int(process.env.QUEUE_PREFETCH) || 1;
config.eventsServiceHost = process.env.EVENTS_SERVICE_HOST || 'https://ip-events-service-stage.herokuapp.com';
config.eventsServiceAuth = process.env.EVENTS_SERVICE_AUTH;
