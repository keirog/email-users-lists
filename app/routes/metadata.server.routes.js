'use strict';

const metadata = require('../controllers/metadata.server.controller');

module.exports = (app) => {
  app.route('/metadata')
    .get(metadata.list);
};
