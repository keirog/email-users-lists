'use strict';

// External modules
const mongoose = require('mongoose');
const extend = require('extend');

// Internal modules
const List = mongoose.model('List');

exports.create = (req, res) => {
    let list = new List(req.body);
    list.save((err) => {
        if (err) {
            return res.status(400).send({
                //TODO: errorHandler.getErrorMessage(err)
                message: err
            });
        }
        else {
            res.json(list);
        }
    });
};

exports.list = (req, res) => {

    List.find({})
        //TODO: allow GET /lists sorting override
        .sort({'name': 1})
        .exec((err, list) => {
            /* istanbul ignore if */
            if (err) {
                return res.status(400).send({
                    //TODO: errorHandler.getErrorMessage(err)
                    message: err
                });
            }
            else {
                res.json(list);
            }
        });
};

exports.read = (req, res) => {
    res.json(req.list);
};

exports.update = (req, res, next) => {

    let list = req.list;

    list = extend(list, req.body);

    list.save((err) => {
        if (err) {
            return res.status(400).send({
                //TODO: errorHandler.getErrorMessage(err)
                message: err
            });
        }
        else {
            res.json(list);
        }
    });
};

exports.delete = (req, res, next) => {
    req.list.remove((err) => {
        /* istanbul ignore if */
        if (err) {
            return res.status(400).send({
                //TODO: errorHandler.getErrorMessage(err)
                message: err
            });
        }
        else {
            res.json(req.list);
        }
    });
};

exports.listById = (req, res, next, id) => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'List is invalid'
        });
    }

    List.findOne({ _id: id }, (err, list) => {
        /* istanbul ignore next */
        if (err) {
            return next(err);
        }
        else {
            req.list = list;
            next();
        }
    });
};
