'use strict';

// External modules
const mongoose = require('mongoose');
const extend = require('extend');

// Models
const User = mongoose.model('User');

exports.create = (req, res) => {
    let user = new User(req.body);
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

    User.find({})
        //TODO: allow GET /users sorting override
        .sort({'name': -1})
        .exec((err, user) => {
            /* istanbul ignore if */
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
        else {
            req.user = user;
            next();
        }
    });
};
