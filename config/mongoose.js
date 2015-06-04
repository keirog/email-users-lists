'use strict';

var config = require('./config'),
    mongoose = require('mongoose');

module.exports = function() {

    var db = mongoose.connect(config.db);

    console.log('HERE!')


    require('../app/models/lists.server.model');
    require('../app/models/users.server.model');

    return db;
};