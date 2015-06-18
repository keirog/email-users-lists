'use strict';

exports.handle = (req, res) => {

    let health = {};

    health.schemaVersion = 1;
    health.name = 'Email Platform Users-Lists';
    health.description = 'Email Platform Users-Lists REST API';
    health.checks = [];

    res.status(200).json(health);
};