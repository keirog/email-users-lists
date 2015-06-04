'use strict';

// External modules
const mongoose = require('mongoose');
const extend = require('extend');

// Internal modules
const User = require('mongoose').model('User');

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
    res.json(req.user);
};

exports.update = (req, res, next) => {

    let user = req.user;

    user = extend(user, req.body);

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

exports.userById = (req, res, next, id) => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'User is invalid'
        });
    }

    User.findOne({ _id: id }, (err, user) => {
        /* istanbul ignore next */
        if (err) {
            return next(err);
        }
        else {
            req.user = user;
            next();
        }
    });
};
