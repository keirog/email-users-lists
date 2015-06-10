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

    //TODO: test headers

    let listId = req.list;
    let page = (Number(req.query.p) > 0 ? Number(req.query.p) : 1) - 1;
    //TODO: use config for pagination defaults
    let perPage = (Number(req.query.pp) > 0 ? Number(req.query.pp) : 100);

    res.header('X-Page', page + 1);
    res.header('X-Per-Page', perPage);

    User.count({'lists': listId }, (countErr, count) => {

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
                                res.json(decryptedUsers);
                            }

                        });
                }
            });
    });
};