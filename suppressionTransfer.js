'use strict';

require('dotenv').load({silent: true});
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const async = require('async');
const fetch = require('node-fetch');
const mongoose = require('./config/mongoose')();
const User = mongoose.model('User');
const crypto = require('./app/utils/crypto.server.utils');

let limit = 100;
let counter = 0;
let removeCounter = 0;
let updateCounter = 0;
let hasDocs = true;
let objectId = '';


let query = {
  $or: [{ expired: true }, { manuallySuppressed: true }, { automaticallySuppressed: true }, { externallySuppressed: true }]
};


User.findOne(query)
  .sort({_id: 1})
  .skip(counter * limit)
  .exec((err, user) => {
    objectId = user._id;

    async.whilst(() => hasDocs, next => {
      let newQuery = Object.assign({}, query, {_id: {$gte: objectId}});
      User.find(newQuery)
        .sort({_id: 1})
        .limit(limit)
        .exec((err, docs) => {
          if (!(++counter * limit % 500)) {
            console.log(counter * limit);
          }

          if (!docs.length) {
            console.log('finished');
            hasDocs = false;
            return next();
          }
          
          objectId = docs[docs.length -1];
          
          async.each(docs, (user, cb) => {

            if (user.manuallySuppressed || user.automaticallySuppressed) {
              user.suppressedNewsletter = true;
              user.suppressedMarketing = true;
              user.suppressedRecommendation = true;
              user.suppressedAccount = true;
              user.save()
                .then(() => cb())
                .catch(cb);

            } else if (user.externallySuppressed) {
              user.suppressedMarketing = true;
              user.suppressedNewsletter = false;
              user.suppressedRecommendation = false;
              user.suppressedAccount = false;
              user.lists = [];
              user.save()
                .then(() => cb())
                .catch(cb);
            } else {
              cb();
            }

        }, err => {
          return next(err);
        });
      });
    }, (err, n) => {
      console.log(err, n);
    });
  });
