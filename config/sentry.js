'use strict';

const config = require('./config');
const dsn = config.sentryDSN;

exports.init = () => {
  if (dsn) {
    const raven = require('raven');
    return new raven.Client(dsn, {logger: 'root'});
  }
  return {captureError: () => {}};
};

