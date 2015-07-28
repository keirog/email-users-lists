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
        businessImpact: 'The users-lists cache cannot be reached.',
        technicalSummary: 'Either Heroku, or the Express HTTP server or the underlying MongoDB database ar down.',
        panicGuide: 'Login to Heroku and check what is the most recent error in Papertrail. Act accordingly.',
        lastUpdated: now.toISOString()
    }];

    res.status(200).json(health);
};