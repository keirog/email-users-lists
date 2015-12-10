'use strict';

const config = require('./config');
const mongoose = require('mongoose');

module.exports = function() {

    let opts = { replset: {readPreference: 'ReadPreference.SECONDARY_PREFERRED'} };

    const db = mongoose.connect(config.db, opts);

    require('../app/models/lists.server.model');
    require('../app/models/users.server.model');

    return db;
};