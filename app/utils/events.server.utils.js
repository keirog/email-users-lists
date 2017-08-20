const EventEmitter = require('events');
const logger = require('../../config/logger');

const updateEmitter = new EventEmitter();
updateEmitter.on('error', (err) => {
  logger.error(`Update Emitter error: ${err}`);
});

module.exports = updateEmitter;
