'use strict';

// External modules
const mongoose = require('mongoose');
const async = require('async');

// Our modules
const crypto = require('../utils/crypto.server.utils');

// Models
const List = mongoose.model('List');
const User = mongoose.model('User');

exports.list = (req, res) => {

    let listId = req.list;
    let page = (Number(req.query.p) > 0 ? Number(req.query.p) : 1) - 1;
    //TODO: use config for pagination defaults
    let perPage = (Number(req.query.pp) > 0 ? Number(req.query.pp) : 100);

    res.header('X-Page', page + 1);
    res.header('X-Per-Page', perPage);

    let t1 = Date.now();
    console.log('Request received');

    User.count({'lists': listId }, (countErr, count) => {

        let t2 = Date.now();
        console.log('Users counted', t2 - t1);

        res.header('X-Total-Count', count);

        User.find({'lists': listId}, {__v: 0, lists: 0, createdOn: 0, _id: 0 })
            .lean()
            .sort({'createdOn': 1})
            .limit(perPage)
            .skip(perPage * page)
            .exec((err, users) => {
                /* istanbul ignore if */
                if (err) {
                    return res.status(400).send({
                        //TODO: errorHandler.getErrorMessage(err)
                        message: err
                    });
                }
                else {
                    let t3 = Date.now();
                    console.log('Users found', t3 - t2);

                    // Asynchronously decrypt the users array
                    async.map(users,
                        // Iterator
                        (user, next) => {
                            user.email = crypto.decrypt(user.email);
                            next(null, user);
                        },
                        // Callback
                        (encryptErr, decryptedUsers) => {
                            /* istanbul ignore if */
                            if (encryptErr) {
                                return res.status(400).send({
                                    message: encryptErr
                                });
                            }
                            else {
                                let t4 = Date.now();
                                console.log('Users decrypted', t4 - t3);
                                res.json(decryptedUsers);
                            }

                        });
                }
            });
    });
};