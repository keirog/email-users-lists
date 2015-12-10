'use strict';

const config = require('./config');
const mongoose = require('mongoose');

module.exports = function() {

    const db = mongoose.connect(config.db);

    require('../app/models/lists.server.model');
    require('../app/models/users.server.model');

    return db;
};