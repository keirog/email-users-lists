'use strict';

// External modules
const mongoose = require('mongoose');

// Models
const List = mongoose.model('List');
const User = mongoose.model('User');

exports.list = (req, res) => {

    let listId = req.list;

    User.find({ 'lists': listId })
        //TODO: allow GET /users sorting override
        .sort({'name': 1})
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