'use strict';

const mongoose = require('mongoose');

let isDBUp = false;
let dbUpLastUpdated;

/* istanbul ignore next */
function checkDBUp() {
  mongoose.connection.db.admin().ping().then(result => {
    if (!result) {
      isDBUp = false;
      return;
    }
    isDBUp = true;
    dbUpLastUpdated = new Date().toISOString();
  }).catch(err => {
    isDBUp = false;
    dbUpLastUpdated = new Date().toISOString();
  });
}

exports.handle = (req, res) => {

    let health = {};
    let now = new Date().toISOString;

    health.schemaVersion = 1;
    health.systemCode = 'email-users-lists';
    health.name = 'Email Platform Users-Lists';
    health.description = 'Email Platform Users-Lists REST API';
    health.checks = [];

		let dbCheckObj = {
						name: 'mongodDb is Up',
						id: 'email-users-lists-db-check',
						ok: false, //defaults to false
						severity: 1,
						businessImpact: 'Will not be able to send emails via simple send service, nor access user preferences and suppressions.',
						technicalSummary: 'Pings the Db connection to ensure proper response and connectivity',
						panicGuide: 'First, verify that there is not a global issue with the Compose by visiting https://status.compose.io. ' +
							'If there is a global issue with Compose, then no further action can be taken to fix the issue. ' +
							'If there is no Compose issue, visit the Heroku dashboard for ft-email-users-lists at ' + 
              'https://dashboard.heroku.com/apps/ft-email-users-lists/resources. ' +
							'Go to the resources tab and select Compose MongoDB. In the Compose interface, go to the admin tab and trigger a primary step-down ' +
							'by clicking on the Trigger Step-down button in the Change primary section. ' +
							'Wait a few minutes to see if the step down has fixed the issue. If not, go back to resources tab on the Heroku console, ' +
							'set all the dynos to 0, and reset them after a few seconds to their original value.',
						lastUpdated: dbUpLastUpdated
		};

		dbCheckObj.ok = isDBUp;
		health.checks.push(dbCheckObj);

    res.json(health);
};

// Wait until db connection is established before pinging DB for first time
setInterval(checkDBUp, 10000);
