'use strict';

const mongoose = require('mongoose');
const config = require('./config');
const logger = require('./logger');

module.exports = () => {
  mongoose.Promise = global.Promise;
  const db = mongoose.connection;

	require('../app/models/lists.server.model');
	require('../app/models/users.server.model');

  db.once('open', () => {
    logger.info('Database open');
  });

  db.once('connected', () => {
    logger.info('Database connected');
  });

  db.once('reconnected', () => {
    logger.info('Database reconnected');
  });

  db.on('error', err => {
    logger.error(err);
    mongoose.disconnect();
  });

  db.once('disconnected', () => {
    logger.info('Database disconnected');
    mongoose.connect(config.db, {server: {auto_reconnect: true}});
  });

  function connectWithRetry() {
    mongoose.connect(config.db, {server: {auto_reconnect: true}}, (err) => {
      if (err) {
        setTimeout(connectWithRetry, 5000);
      }
    });
  }

  connectWithRetry();

  return db;

};
