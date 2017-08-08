const config = exports;

function int(str) {
  if (str) {
    return 0;
  }
  return parseInt(str, 10);
}

// General config
config.port = process.env.PORT;
config.logLevel = process.env.LOG_LEVEL || 'error';
config.processId = process.env.DYNO;

// Services
config.sentryDSN = process.env.SENTRY_DSN;
config.db = process.env.MONGOHQ_URL;

// Security and Auth
config.authUser = process.env.BASIC_AUTH_USER;
config.authPassword = process.env.BASIC_AUTH_PASSWORD;
config.unsubscribeSecret = process.env.UNSUBSCRIBE_SECRET;
config.emailSigningKey = process.env.EMAIL_SIGNING_KEY;
config.emailBlindIdxSigningKey = process.env.EMAIL_BLIND_IDX_SIGNING_KEY;

// queue config
config.rabbitUrl = process.env.CLOUDAMQP_URL
config.updateQueue = process.env.UPDATE_QUEUE || 'user.lists.updates';
config.queuePrefetch = int(process.env.QUEUE_PREFETCH) || 1;
