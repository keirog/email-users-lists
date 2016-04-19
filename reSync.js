'use strict';

require('dotenv').load({silent: true});
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const async = require('async');
const fetch = require('node-fetch');
const mongoose = require('./config/mongoose')();
const User = mongoose.model('User');
const crypto = require('./app/utils/crypto.server.utils');

let limit = 40;
let counter = 7700000 / limit;
let removeCounter = 0;
let updateCounter = 350;
let hasDocs = true;
let objectId = '';

User.findOne()
  .sort({_id: 1})
  .skip(counter * limit)
  .exec((err, user) => {
    objectId = user._id;

    async.whilst(() => hasDocs, next => {
      User.find({_id: {$gte: objectId}})
        .sort({_id: 1})
        .limit(limit)
        .exec((err, docs) => {
          if (!(++counter * limit % 5000)) {
            console.log(counter * limit);
          }

          if (!docs.length) {
            console.log('finished');
            hasDocs = false;
            return next();
          }
          
          objectId = docs[docs.length -1];
          
          async.each(docs, (user, cb) => {

            let uuid = user.uuid;
            fetch('https://user-api-euwest1-prod.memb.ft.com:8443/membership/users/v1/' + uuid)
              .then(res => {
                if (res.status === 404) {
                  User.findOneAndRemove({_id: user._id}, err => {
                    console.log('removed user: ', user.uuid, ++removeCounter);
                    cb(err);
                  });
                } else if (res.status === 200) {
                  let email = crypto.decrypt(user.email);
                  if (email !== email.toLowerCase()) {
                    user.email = crypto.encrypt(email);
                    user.save(err => {
                    console.log('Email changed for: ', email, ++updateCounter);
                      cb(err);
                    });
                  } else {
                    cb();
                  }
                } else {
                  console.log('Not valid: ', uuid);
                  cb();
                }
            }).catch(err => cb(err));
        }, err => {
          return next(err);
        });
      });
    }, (err, n) => {
      console.log(err, n);
    });
  });
