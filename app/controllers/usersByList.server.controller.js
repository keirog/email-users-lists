'use strict';

// External modules
const mongoose = require('mongoose');
const async = require('async');

// Our modules
const crypto = require('../utils/crypto.server.utils');
const logger = require('../../config/logger');

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
    logger.debug('Request received');

    User.count({'lists': listId }, (countErr, count) => {

        let t2 = Date.now();
        logger.debug('Users counted', t2 - t1);

        res.header('X-Total-Count', count);

        User.find({'lists.list': listId}, {__v: 0, createdOn: 0, _id: 0 })
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
                    logger.debug('Users found', t3 - t2);

                    // Asynchronously decrypt the users array
                    async.map(users,
                        // Iterator
                        (user, next) => {
                            user.email = crypto.decrypt(user.email);

                            // Synchronously decrypt alternative emails
                            user.lists = user.lists.map((listRelationship) => {
                                if (listRelationship.alternativeEmail) {
                                    listRelationship.alternativeEmail = crypto.decrypt(listRelationship.alternativeEmail);
                                }
                                return listRelationship;
                            });

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
                                logger.debug('Users decrypted', t4 - t3);
                                res.json(decryptedUsers);
                            }

                        });
                }
            });
    });
};