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
            return res.status(400).json({
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
        .exec((err, lists) => {
            /* istanbul ignore if */
            if (err) {
                return res.status(400).json({
                    //TODO: errorHandler.getErrorMessage(err)
                    message: err
                });
            }
            else {
                res.json(lists);
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
            return res.status(400).json({
                //TODO: errorHandler.getErrorMessage(err)
                message: err
            });
        }
        else {
            res.json(list);
        }
    });
};

exports.listById = (req, res, next, id) => {

    List.findOne({ _id: id }, (err, list) => {

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'List is invalid'
            });
        }

        /* istanbul ignore next */
        if (err) {
            return next(err);
        }
        else if (list) {
            req.list = list;
            next();
        }
        else {
            return res.status(404).json({
                message: 'List not found'
            });
        }
    });
};
