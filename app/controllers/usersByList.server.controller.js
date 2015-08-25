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

    let listId = req.list._id;
    let page = (Number(req.query.p) > 0 ? Number(req.query.p) : 1) - 1;
    //TODO: use config for pagination defaults
    let perPage = (Number(req.query.pp) > 0 ? Number(req.query.pp) : 100);

    res.header('X-Page', page + 1);
    res.header('X-Per-Page', perPage);

    let t1 = Date.now();
    logger.debug('Request received');

    User.count({'lists.list': listId }, (countErr, count) => {

        let t2 = Date.now();
        logger.debug('Users counted', { time: t2 - t1 });

        res.header('X-Total-Count', count);

        User.find({'lists.list': listId}, {__v: 0, createdOn: 0, _id: 0 })
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
                    logger.debug('Users found', { time: t3 - t2 });

                    // Asynchronously decrypt the users array
                    async.map(users,
                        // Iterator
                        (user, next) => {
                            user.email = crypto.decrypt(user.email);

                            //Return only the list we are asking for
                            user.lists = user.lists.filter((listRelationship) => {
                                return listRelationship.list.toString() === listId.toString();
                            });

                            // Synchronously decrypt the alternative email, if there is any
                            user.lists = user.lists.map((listRelationship) => {
                                if (listRelationship.alternativeEmail) {
                                    listRelationship.alternativeEmail = crypto.decrypt(listRelationship.alternativeEmail);
                                }
                                return listRelationship;
                            });

                            let userOutput = {
                                uuid: user.uuid,
                                expired: user.expired,
                                manuallySuppressed: user.manuallySuppressed,
                                automaticallySuppressed: user.automaticallySuppressed
                            };

                            if (user.firstName) {
                                userOutput.fistName = user.firstName;
                            }

                            if (user.lastName) {
                                userOutput.lastName = user.lastName;
                            }

                            // Use the alternative email if it exists, otherwise use the default email
                            userOutput.email = user.lists[0].alternativeEmail || user.email;

                            if (user.lists[0].frequency) {
                                userOutput.frequency = user.lists[0].frequency;
                            }

                            if (user.lists[0].products && user.lists[0].products.length) {
                                userOutput.products = user.lists[0].products;
                            }

                            next(null, userOutput);
                        },
                        // Callback
                        (encryptErr, usersOutput) => {
                            /* istanbul ignore if */
                            if (encryptErr) {
                                return res.status(400).send({
                                    message: encryptErr
                                });
                            }
                            else {
                                let t4 = Date.now();
                                logger.debug('Users decrypted', { time: t4 - t3 });
                                res.json(usersOutput);
                            }

                        });
                }
            });
    });
};