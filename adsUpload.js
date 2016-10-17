require('dotenv').load({ silent: true });

const fetch = require('node-fetch');
const csv = require('fast-csv');
const fs = require('fs');
const omit = require('lodash/omit');
const config = require('./config/config');
const async = require('async');

const stream = fs.createReadStream("./ads-data.csv");

const csvStream = csv({ headers: true })
  .transform((data, next) => {
    console.log(data.uuid);
    const options = {
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
        Authorization: config.authUser
      },
      body: JSON.stringify({
        metadata: omit(data, 'uuid')
      })
    };

    fetch(`https://email-webservices.ft.com/users/${data.uuid}`, options)
      .then(res => {
        console.log(res.status);
        return res.json();
      })
      .then(jsonRes => {
        next();
      })
      .catch((err) => {
        console.log(err)
        next();
      });
  })
  .on('data', (data) => {
    console.log(data);
  })
  .on('end', () => {
    console.log('end');
  });


stream.pipe(csvStream);
