const Queue = require('./queue.server.service');
const updateEmitter = require('../utils/events.server.utils');
const config = require('../../config/config');
const logger = require('../../config/logger');

const queue = new Queue(config, config.queuePrefetch);

updateEmitter.on('user-update', async (user) => {
  try {
    await queue.publish(user, config.updateQueue);
  } catch (err) {
    logger.error(`Error publishing event to queue: ${err}`);
  }
});

module.exports = queue;
