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

    //TODO: test headers

    let page = (Number(req.query.p) > 0 ? Number(req.query.p) : 1) - 1;
    //TODO: use config for pagination defaults
    let perPage = (Number(req.query.pp) > 0 ? Number(req.query.pp) : 100);

    res.header('X-Page', page + 1);
    res.header('X-Per-Page', perPage);

    User.count({}, (countErr, count) => {

        res.header('X-Total-Count', count);

        User.find({}, { __v: 0, createdOn: 0})
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
                    res.json(users);
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
