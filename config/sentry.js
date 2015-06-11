'use strict';

exports.init = () => {
    const dsn = process.env.SENTRY_DSN;
    if (dsn) {
        const raven = require('raven');
        const client = new raven.Client(dsn);
    }
};