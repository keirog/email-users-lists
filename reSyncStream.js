'use strict';

require('dotenv').load({silent: true});
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const async = require('async');
const fetch = require('node-fetch');
const mongoose = require('./config/mongoose')();
const User = mongoose.model('User');
const crypto = require('./app/utils/crypto.server.utils');

let limit = 20;
let counter = 0;
let removeCounter = 0;
let saved = 0;
let readingDone = false;
let hasDocs = true;

function checkFinished() {
  if (saved === counter && readingDone) {
    console.log('finished with: ' + counter + ' processed');
    process.exit();
  }
}

let stream = User.find({}, {}, {timeout:false}).stream();

stream.on('data', doc => {
  counter++;

  let user = doc; 
  let uuid = user.uuid;
  fetch('https://user-api-euwest1-prod.memb.ft.com:8443/membership/users/v1/' + uuid)
    .then(res => {
      console.log(res.status)
      if (res.status === 404) {
        User.findOneAndRemove({_id: user._id}, err => {
          console.log('removed user: ', user._id, ++removeCounter);
          saved++;
          console.log(saved);
          checkFinished();
        });
      } else if (res.status === 200) {
        //let email = crypto.decrypt(user.email);
        //user.email = crypto.encrypt(email);
        //user.save(err => {
          //console.log(err);
          //saved++;
          //console.log(saved);
          checkFinished();
        //});
      } else {
        saved++;
        console.log('Not valid: ', uuid);
        checkFinished();
      }
  }).catch(err => {console.log('here'); console.log(err) });
});

stream.on('close', () => {
  readingDone = true;
});
