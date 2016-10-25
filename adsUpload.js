require('dotenv').load({ silent: true });

const fetch = require('node-fetch');
const csv = require('fast-csv');
const fs = require('fs');
const omit = require('lodash/omit');
const config = require('./config/config');
const eachLimit = require('async/eachLimit');

const stream = fs.createReadStream("./ads-data.csv");
const users = [];
let count = 0;

function patchUsers() {
  eachLimit(users, 20, (user, cb) => {
    const options = {
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
        Authorization: config.authUser
      },
      body: JSON.stringify({
        metadata: omit(user, 'uuid')
      })
    };

    fetch(`https://email-webservices.ft.com/users/${user.uuid}`, options)
      .then(res => {
        return res.json();
      })
      .then(jsonRes => {
        console.log(++count);
        cb();
      })
      .catch((err) => {
        console.log(++count);
        console.log(err)
        cb();
      });
  });
}

  const csvStream = csv({ headers: true })
    .on('data', (data) => {
      users.push(data);
    })
    .on('end', () => {
      console.log('end');
      console.log(users.length);
      patchUsers();
    });

stream.pipe(csvStream);
