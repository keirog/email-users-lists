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

    let options = {'lists.list': listId};

    /**
     * The "valid" filter
     */
    if (req.query.valid === '' || req.query.valid === 'true') {
        options.expired = false;
        options.manuallySuppressed = false;
        options.automaticallySuppressed = false;
        options.externallySuppressed = false;
    } else if (req.query.valid === 'false') {
        options.$or = [{ expired: true }, { manuallySuppressed: true }, { automaticallySuppressed: true }, { externallySuppressed: true }];
    }

    res.header('X-Page', page + 1);
    res.header('X-Per-Page', perPage);

    let t1 = Date.now();
    logger.debug('Request received');

    User.count(options, (countErr, count) => {

        let t2 = Date.now();
        logger.debug('Users counted', { time: t2 - t1 });

        res.header('X-Total-Count', count);

        User.find(options, {__v: 0, createdOn: 0, _id: 0 })
            .limit(perPage)
            .skip(perPage * page)
            .lean()
            .exec((err, users) => {
                /* istanbul ignore if */
                if (err) {
                    return res.status(400).json({
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

                            let userOutput = {
                                uuid: user.uuid,
                                expired: user.expired,
                                manuallySuppressed: user.manuallySuppressed,
                                automaticallySuppressed: user.automaticallySuppressed,
                                externallySuppressed: user.externallySuppressed,
                                metadata: user.metadata
                            };

                            if (user.firstName) {
                                userOutput.firstName = user.firstName;
                            }

                            if (user.lastName) {
                                userOutput.lastName = user.lastName;
                            }

                            if (user.lists[0].frequency) {
                                userOutput.frequency = user.lists[0].frequency;
                            }

                            if (user.lists[0].products && user.lists[0].products.length) {
                                userOutput.products = user.lists[0].products;
                            }

                            userOutput.email = user.email;

                            next(null, userOutput);
                        },
                        // Callback
                        (encryptErr, usersOutput) => {
                            /* istanbul ignore if */
                            if (encryptErr) {
                                return res.status(400).json({
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
