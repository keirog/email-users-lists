'use strict';

// External modules
const mongoose = require('mongoose');
const extend = require('extend');
const async = require('async');
const omit = require('lodash/omit');

// Our modules
const crypto = require('../utils/crypto.server.utils');
const manageUsers = require('../utils/userManagement.server.utils');
const logger = require('../../config/logger');
const sentry = require('../../config/sentry').init();
const validationCategories = require('../utils/validationCategories.server.utils');

// Models
const User = mongoose.model('User');

exports.create = (req, res) => {

    logger.debug('Request to create a user received...');
    let userObj = req.body;

    if (!userObj.email) {
        return res.status(400).json({
            message: 'missing user email'
        });
    }

    manageUsers.manageExpiration(userObj);

    const email = userObj.email;
    userObj.email = crypto.encrypt(email);
    userObj.emailBlindIdx = crypto.hmacDigest(email);

    let user = new User(userObj);
    user.save((saveErr) => {
        if (saveErr) {
            logger.warn(saveErr);
            sentry.captureError(saveErr);
            return res.status(400).json({
                message: saveErr
            });
        }

        // Send the decrypted emails back
        user.email = email;
        return res.json(omit(user.toObject(), 'emailBlindIdx'));

    });
};

exports.list = (req, res) => {

    let t1 = Date.now();
    logger.debug('Request to list the users received...');

    let page = (Number(req.query.p) > 0 ? Number(req.query.p) : 1) - 1;
    let perPage = (Number(req.query.pp) > 0 ? Number(req.query.pp) : 100);

    res.header('X-Page', page + 1);
    res.header('X-Per-Page', perPage);

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

    /**
     * The "email" filter
     */

    if (req.body.email) {
      options.emailBlindIdx = !Array.isArray(req.body.email) ? crypto.hmacDigest(req.body.email) :
        { $in: req.body.email.map(email => crypto.hmacDigest(email)) };
    }

    User.count(options, (countErr, count) => {

        let t2 = Date.now();
        logger.debug('Users counted', { time: t2 - t1 });

        res.header('X-Total-Count', count);

        // Currently we do not retrieve the List relationships here. It can be changed if needed.

        User.find(options, { __v: 0, createdOn: 0, _id: 0, lists: 0 })
            .limit(perPage)
            .skip(perPage * page)
            .lean()
            .exec((findErr, users) => {
                /* istanbul ignore if */
                if (findErr) {
                    logger.warn(findErr);
                    return res.status(400).json({
                        //TODO: errorHandler.getErrorMessage(findErr)
                        message: findErr
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
                            next(null, omit(user, 'emailBlindIdx'));
                        },
                        // Callback
                        (encryptErr, decryptedUsers) => {
                            /* istanbul ignore if */
                            if (encryptErr) {
                                logger.warn(encryptErr);
                                return res.status(400).json({
                                    message: encryptErr
                                });
                            }
                            else {
                                let t4 = Date.now();
                                logger.debug('Users decrypted', { time: t4 - t3 });
                                res.json(decryptedUsers);
                            }

                        });
                }
            });

    });

};

exports.search = (req, res) => {

    let t1 = Date.now();
    logger.debug('Request to list the users received...');

    let page = (Number(req.query.p) > 0 ? Number(req.query.p) : 1) - 1;
    let perPage = (Number(req.query.pp) > 0 ? Number(req.query.pp) : 100);

    res.header('X-Page', page + 1);
    res.header('X-Per-Page', perPage);

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

    /**
     * The "email" search filter
     * Single email or Array of emails
     * Searches on blind index hash
     */
    if (req.body.email) {
      options.emailBlindIdx = !Array.isArray(req.body.email) ? crypto.hmacDigest(req.body.email) :
        { $in: req.body.email.map(email => crypto.hmacDigest(email)) };
    }

    User.count(options, (countErr, count) => {

        let t2 = Date.now();
        logger.debug('Users counted', { time: t2 - t1 });

        res.header('X-Total-Count', count);

        // Currently we do not retrieve the List relationships here. It can be changed if needed.

        User.find(options, { __v: 0, createdOn: 0, _id: 0, lists: 0 })
            .limit(perPage)
            .skip(perPage * page)
            .lean()
            .exec((findErr, users) => {
                /* istanbul ignore if */
                if (findErr) {
                    logger.warn(findErr);
                    return res.status(400).json({
                        //TODO: errorHandler.getErrorMessage(findErr)
                        message: findErr
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
                            next(null, omit(user, 'emailBlindIdx'));
                        },
                        // Callback
                        (encryptErr, decryptedUsers) => {
                            /* istanbul ignore if */
                            if (encryptErr) {
                                logger.warn(encryptErr);
                                return res.status(400).json({
                                    message: encryptErr
                                });
                            }
                            else {
                                let t4 = Date.now();
                                logger.debug('Users decrypted', { time: t4 - t3 });
                                res.json(decryptedUsers);
                            }

                        });
                }
            });

    });

};

exports.read = (req, res) => {
    return res.json(omit(req.user.toObject(), 'emailBlindIdx'));
};

exports.patch = (req, res, next) => {

    let user = req.user;

    logger.debug('Request to edit a user received');
    logger.debug(req.body);

    if (req.body.lists) {
        return res.status(403).send({
            message: 'Forbidden. Lists cannot be edited via this method'
        });
    }

    manageUsers.manageSuppression(user, req.body);

    user = extend(user, req.body);

    manageUsers.manageExpiration(user);

    // Encrypt the email and digest
    if (user.email) {
      const email = user.email;
      user.emailBlindIdx = crypto.hmacDigest(email);
      user.email = crypto.encrypt(email);
    }

    // Update
    user.save((updateErr) => {

        /* istanbul ignore if */
        if (updateErr) {
            logger.warn(updateErr);
            return res.status(400).json({
                //TODO: errorHandler.getErrorMessage(err)
                message: updateErr
            });
        }
        else {
            user.email = crypto.decrypt(user.email);
            res.json(omit(user.toObject(), 'emailBlindIdx'));
        }
    });
};

exports.updateOne = (req, res, next) => {

    if (!req.body.key || !req.body.user) {
        return res.status(400)
            .send({ message: 'Please provide search key and update' });
    }

    if (req.body.user && req.body.user.lists) {
        return res.status(403).send({
            message: 'Forbidden. Lists cannot be edited via this method'
        });
    }

    let key = req.body.key;
    let searchObj = {};

    if (key.email) {
        searchObj.emailBlindIdx = crypto.hmacDigest(key.email);
    } else if (key.uuid) {
        searchObj.uuid = key.uuid;
    } else {
        return res.status(400)
            .send({ message: 'Please search by uuid or email' });
    }

    User.findOne(searchObj).exec((findErr, user) => {
        /* istanbul ignore next */
        if (findErr) {
            logger.warn(findErr);
            return next(findErr);
        }
        else if (user) {
            const email = user.email;
            user.email = crypto.decrypt(email);
            manageUsers.manageSuppression(user, req.body.user);
            user = extend(user, req.body.user);
            manageUsers.manageExpiration(user);
            const newEmail = user.email;
            user.email = crypto.encrypt(newEmail);
            user.emailBlindIdx = crypto.hmacDigest(newEmail);

            user.save(user, (updateErr) => {

                    /* istanbul ignore if */
                    if (updateErr) {
                        logger.warn(updateErr);
                        return res.status(400).json({
                            //TODO: errorHandler.getErrorMessage(err)
                            message: updateErr
                        });
                    }
                    else {
                        user.email = crypto.decrypt(user.email);
                        res.json(omit(user.toObject(), 'emailBlindIdx'));
                    }
                });
        }
        else {
            return res.status(404).json({
                message: 'User not found'
            });

        }
    });
};

exports.userByUuid = (req, res, next, uuid) => {

    User.findOne({ uuid: uuid }, { __v: 0, createdOn: 0 }, (findErr, user) => {
        /* istanbul ignore next */
        if (findErr) {
            logger.warn(findErr);
            return next(findErr);
        }
        else if (user) {
            user.email = crypto.decrypt(user.email);

            req.user = user;
            return next();
        }
        else {
            return res.status(404).json({
                message: 'User not found'
            });

        }
    });
};
