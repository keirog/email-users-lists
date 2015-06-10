'use strict';

// External modules
const mongoose = require('mongoose');
const extend = require('extend');
const async = require('async');

// Our modules
const crypto = require('../utils/crypto.server.utils');
const logger = require('../../config/logger');

// Models
const User = mongoose.model('User');

exports.create = (req, res) => {
    let userObj = req.body;

    // Encrypt the email
    userObj.email = crypto.encrypt(userObj.email);

    let user = new User(userObj);
    user.save((err) => {
        if (err) {
            return res.status(400).send({
                //TODO: errorHandler.getErrorMessage(err)
                message: err
            });
        }
        else {
            res.json(user);
        }
    });
};

exports.list = (req, res) => {

    let t1 = Date.now();
    logger.debug('Request received');

    let page = (Number(req.query.p) > 0 ? Number(req.query.p) : 1) - 1;
    //TODO: use config for pagination defaults
    let perPage = (Number(req.query.pp) > 0 ? Number(req.query.pp) : 100);

    res.header('X-Page', page + 1);
    res.header('X-Per-Page', perPage);

    User.count({}, (countErr, count) => {

        let t2 = Date.now();
        logger.debug('Users counted', t2 - t1);

        res.header('X-Total-Count', count);

        User.find({}, { __v: 0, createdOn: 0, _id: 0 })
            .sort({'createdOn': 1})
            .lean()
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

exports.read = (req, res) => {
    if (req.user) {
        return res.json(req.user);
    }
    else {
        return res.status(404).send({
            message: 'User not found'
        });
    }
};

exports.update = (req, res, next) => {

    let user = req.user;

    user = extend(user, req.body);

    if (user.email) {
        user.email = crypto.encrypt(user.email);
    }

    // Create updated user
    let  updatedUser = user.toObject();

    // Delete _id property
    delete updatedUser._id;

    // Update
    User.update({uuid: updatedUser.uuid}, updatedUser, { runValidators: true }, (updateErr) => {

        /* istanbul ignore if */
        if (updateErr) {
            return res.status(400).send({
                //TODO: errorHandler.getErrorMessage(err)
                message: updateErr
            });
        }
        else {
            user.email = crypto.decrypt(user.email);
            res.json(user);
        }
    });
};

exports.delete = (req, res, next) => {
    req.user.remove((err) => {
        /* istanbul ignore if */
        if (err) {
            return res.status(400).send({
                //TODO: errorHandler.getErrorMessage(err)
                message: err
            });
        }
        else {
            res.json(req.user);
        }
    });
};

exports.userByUuid = (req, res, next, uuid) => {

    User.findOne({ uuid: uuid }, (findErr, user) => {
        /* istanbul ignore next */
        if (findErr) {
            return next(findErr);
        }
        else if (user) {
                user.email = crypto.decrypt(user.email);
                req.user = user;
                return next();
        }
        else {
            req.user = user;
            return next();
        }
    });
};
