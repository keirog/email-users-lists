'use strict';

// External modules
const mongoose = require('mongoose');
const async = require('async');
const omit = require('lodash/omit');

// Our modules
const crypto = require('../utils/crypto.server.utils');
const logger = require('../../config/logger');
const validationCategories = require('../utils/validationCategories.server.utils');

// Models
const List = mongoose.model('List');
const User = mongoose.model('User');

exports.list = (req, res) => {

    let listId = req.list._id;
    let page = (Number(req.query.p) > 0 ? Number(req.query.p) : 1) - 1;
    //TODO: use config for pagination defaults
    let perPage = (Number(req.query.pp) > 0 ? Number(req.query.pp) : 100);

    let queryDefaults = {'lists.list': listId};
    let options = {};
    /**
     * The "valid" filter
     */
    try {
        if (req.query.valid === '' || req.query.valid === 'true') {
            options = validationCategories(req.query, false);
        } else if (req.query.valid === 'false') {
            const validatedCategories = validationCategories(req.query, true);
            options = {
                $or: Object.keys(validatedCategories).map((key) => ({
                    [key]: validatedCategories[key]
                }))
            };
        }
    } catch ({message}) {
        return res.status(400).json({ message });
    }

    res.header('X-Page', page + 1);
    res.header('X-Per-Page', perPage);

    let t1 = Date.now();
    logger.debug('Request received');
    options = Object.assign(options, queryDefaults);
    User.count(options, (countErr, count) => {

        let t2 = Date.now();
        logger.debug('Users counted', { time: t2 - t1 });

        res.header('X-Total-Count', count);

        User.find(options, {__v: 0, createdOn: 0, _id: 0, list: 0 })
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
                            const defaultUser = {
                                suppressedNewsletter: { value: false },
                                suppressedMarketing: { value: false },
                                suppressedRecommendation: { value: false },
                                suppressedAccount: { value: false },
                                expiredUser: { value: false },
                            };

                            const userOutput = Object.assign({}, defaultUser, omit(user, 'lists'));
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
