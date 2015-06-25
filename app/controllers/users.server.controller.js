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

    logger.debug('Request to create a user received...');
    let userObj = req.body;

    // Encrypt the email
    userObj.email = crypto.encrypt(userObj.email);

    if (userObj.lists) {

        // Synchronously encrypt alternative emails
        userObj.lists = userObj.lists.map((listRelationship) => {

            /* istanbul ignore else */
            if (listRelationship.alternativeEmail) {
                listRelationship.alternativeEmail = crypto.encrypt(listRelationship.alternativeEmail);
            }
            return listRelationship;
        });
    }

    let user = new User(userObj);
    user.save((saveErr) => {
        if (saveErr) {
            logger.warn(saveErr);
            return res.status(400).send({
                //TODO: errorHandler.getErrorMessage(saveErr)
                message: saveErr
            });
        }
        else {
            res.json(user);
        }
    });
};

exports.list = (req, res) => {

    let t1 = Date.now();
    logger.debug('Request to list the users received...');

    let page = (Number(req.query.p) > 0 ? Number(req.query.p) : 1) - 1;
    let perPage = (Number(req.query.pp) > 0 ? Number(req.query.pp) : 100);

    res.header('X-Page', page + 1);
    res.header('X-Per-Page', perPage);

    User.count({}, (countErr, count) => {

        let t2 = Date.now();
        logger.debug('Users counted', t2 - t1);

        res.header('X-Total-Count', count);

        // Currently we do not retrieve the List relationships here. It can be changed if needed.

        User.find({}, { __v: 0, createdOn: 0, _id: 0, lists: 0 })
            .sort({'createdOn': 1})
            .lean()
            .limit(perPage)
            .skip(perPage * page)
            .exec((findErr, users) => {
                /* istanbul ignore if */
                if (findErr) {
                    logger.warn(findErr);
                    return res.status(400).send({
                        //TODO: errorHandler.getErrorMessage(findErr)
                        message: findErr
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
                                logger.warn(encryptErr);
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
    return res.json(req.user);
};

exports.update = (req, res, next) => {

    logger.debug('Request to edit a user received...');

    let user = req.user;

    if (req.body.lists) {
        return res.status(403).send({
            message: 'Forbidden. Lists cannot be edited via this method'
        });
    }

    user = extend(user, req.body);

    if (user.email) {
        user.email = crypto.encrypt(user.email);
    }

    // Synchronously encrypt alternative emails
    user.lists = user.lists.map((listRelationship) => {

        /* istanbul ignore else */
        if (listRelationship.alternativeEmail) {
            listRelationship.alternativeEmail = crypto.encrypt(listRelationship.alternativeEmail);
        }
        return listRelationship;
    });

    // Create updated user
    let  updatedUser = user.toObject();

    // Delete _id property
    delete updatedUser._id;

    // Update
    User.update({uuid: updatedUser.uuid}, updatedUser, { runValidators: true }, (updateErr) => {

        /* istanbul ignore if */
        if (updateErr) {
            logger.warn(updateErr);
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

exports.delete = (req, res) => {
    req.user.remove((deleteErr) => {
        /* istanbul ignore if */
        if (deleteErr) {
            logger.warn(deleteErr);
            return res.status(400).send({
                //TODO: errorHandler.getErrorMessage(deleteErr)
                message: deleteErr
            });
        }
        else {
            return res.json(req.user);
        }
    });
};

exports.userByUuid = (req, res, next, uuid) => {

    User.findOne({ uuid: uuid }, { __v: 0, createdOn: 0, _id: 0 }, (findErr, user) => {
        /* istanbul ignore next */
        if (findErr) {
            logger.warn(findErr);
            return next(findErr);
        }
        else if (user) {
            user.email = crypto.decrypt(user.email);

            // Synchronously decrypt alternative emails
            user.lists = user.lists.map((listRelationship) => {
                if (listRelationship.alternativeEmail) {
                    listRelationship.alternativeEmail = crypto.decrypt(listRelationship.alternativeEmail);
                }
                return listRelationship;
            });

            req.user = user;
            return next();
        }
        else {
            return res.status(404).send({
                message: 'User not found'
            });

        }
    });
};
