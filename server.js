'use strict';

// External modules
require('dotenv').load({silent: true});

/* istanbul ignore next */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Our modules
const config = require('./config/config');
const express = require('./config/express');
const mongoose = require('./config/mongoose');
const shutdown = require('./app/utils/shutdown.server.utils');
const logger = require('./config/logger');
const sentry = require('./config/sentry').init();

// Open queue connection
const queue = require('./app/services/queueApp.server.service');

const loggerId = 'SERVER:' + config.processId;

let db = mongoose();
let app = express();

/* istanbul ignore next */
process.on('SIGTERM', () => {
  shutdown(loggerId, db, queue);
});
process.on('SIGINT', () => {
  shutdown(loggerId, db, queue);
});


app.listen(config.port, () => {
  logger.info(loggerId, process.env.NODE_ENV + ' server running', { location: 'http://localhost:' + config.port});
});

module.exports = app;
