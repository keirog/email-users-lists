'use strict';

exports.handle = (req, res) => {

    let health = {};
    let now = new Date();

    health.schemaVersion = 1;
    health.name = 'Email Platform Users-Lists';
    health.description = 'Email Platform Users-Lists REST API';
    health.checks = [{ // Random check
        name: "The Application is UP",
        ok: true,
        severity: 2,
        businessImpact: 'Some test text',
        technicalSummary: 'Some test text',
        panicGuide: 'Some test text',
        lastUpdated: now.toISOString()
    }];

    res.status(200).json(health);
};