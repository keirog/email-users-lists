const logger = require('../../config/logger');

/* istanbul ignore next */
module.exports = (loggerId, queue) => {
    logger.info(loggerId,  process.env.NODE_ENV + ' shutting down');
    let ok = Promise.resolve();
    if (queue) {
      ok.then(() => queue.closeChannel());
      ok.then(() => queue.closeConnection());
    }
    ok.then(() => process.exit());
    ok.catch(err => process.exit());
};
