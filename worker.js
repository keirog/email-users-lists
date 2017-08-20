require('dotenv').load({ silent: true });

const config = require('./config/config');
const logger = require('./config/logger');
const shutdown = require('./app/utils/shutdown.server.utils');
const Queue = require('./app/services/queue.server.service');

const loggerId = 'SERVER:' + config.processId;

function start() {
  logger.info('starting event worker');

  const instance = new Queue(config, config.queuePrefetch);

  instance.on('ready', beginWork);
  process.on('SIGTERM', () => shutdown(loggerId, null, instance));
  process.on('SIGINT', () => shutdown(loggerId, null, instance));

  function beginWork() {
    logger.info('worker ready to process queue');
    instance.on('lost', () => shutdown(loggerId, instance));
    instance.startConsumingEvents();
  }
}

start();
