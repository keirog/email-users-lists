const config = exports;

function int(str) {
  if (!str) {
    return 0;
  }
  return parseInt(str, 10);
}

// General config
config.port = process.env.PORT;
config.logLevel = process.env.LOG_LEVEL || 'error';
config.processId = process.env.DYNO;

// Services
config.eventsServiceHost = process.env.EVENTS_SERVICE_HOST || 'https://ip-events-service.herokuapp.com';
config.sentryDSN = process.env.SENTRY_DSN;
config.db = process.env.MONGOHQ_URL;

// Security and Auth
config.authUser = process.env.BASIC_AUTH_USER;
config.authPassword = process.env.BASIC_AUTH_PASSWORD;
config.unsubscribeSecret = process.env.UNSUBSCRIBE_SECRET;
config.emailSigningKey = process.env.EMAIL_SIGNING_KEY;
config.emailBlindIdxSigningKey = process.env.EMAIL_BLIND_IDX_SIGNING_KEY;
config.eventsServiceAuth = process.env.EVENTS_SERVICE_AUTH;

// queue config
config.rabbitUrl = process.env.CLOUDAMQP_URL;
config.updateExchange = process.env.UPDATE_EXCHANGE || 'user.prefs.exchange';
config.updateQueue = process.env.UPDATE_QUEUE || 'user.prefs.updates';
config.deadLetterQueue = process.env.DEAD_LETTER_QUEUE || 'user.prefs.dletter';
config.deadLetterTTL = int(process.env.DEAD_LETTER_TTL) || 5000;
config.queuePrefetch = int(process.env.QUEUE_PREFETCH) || 1;
