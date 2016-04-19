'use strict';

require('dotenv').load({silent: true});
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const async = require('async');
const fetch = require('node-fetch');
const mongoose = require('./config/mongoose')();
const User = mongoose.model('User');
const crypto = require('./app/utils/crypto.server.utils');

//let limit = 20;
let counter = 0;
let updateCounter = 0;
let removeCounter = 0;
let hasDocs = true;

  User.collection.parallelCollectionScan({numCursors: 20, timeout: false}, (err, cursors) => {

    function processCursor(cursor) {

      function processUser(err, user) {
      if (err) {
        console.log(err);
      }

      if (!(++counter % 10000)) {
        console.log(counter);
      }
      if (!user) {
        return;
      }

      let uuid = user.uuid;

      fetch('https://user-api-euwest1-prod.memb.ft.com:8443/membership/users/v1/' + uuid)
        .then(res => {
          if (res.status === 404) {
            User.findOneAndRemove({_id: user._id}, err => {
              if (err) {
                throw err;
              }
              console.log('removed user: ', user._id, ++removeCounter);
              setImmediate(() => {
                cursor.nextObject(processUser);
              });
            });
          } else if (res.status === 200) {
            let email = crypto.decrypt(user.email);
            if (email !== email.toLowerCase()) {
              user.email = crypto.encrypt(email);
              User.update({uuid: user.uuid}, user, {runValidators: true}, err => {
                console.log('Email changed for: ', email, ++updateCounter);
                setImmediate(() => {
                  cursor.nextObject(processUser);
                });
              });
            } else {
              setImmediate(() => {
                cursor.nextObject(processUser);
              });
            }

          } else {
            console.log('Not valid: ', uuid);
            setImmediate(() => {
              cursor.nextObject(processUser);
            });
          }
      }).catch(err => console.log(err));
      }

      cursor.next(processUser);
    }

    for (let cursor of cursors) {
      setImmediate(() => {
        processCursor(cursor);
      });
    }
  });

      //async.eachLimit(docs, 10, (user, cb) => {

        //let uuid = user.uuid;
    //}, err => {
      //return next(err);
    //});
  //});
//});
