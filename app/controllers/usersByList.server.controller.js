'use strict';

// External modules
const mongoose = require('mongoose');

// Models
const List = mongoose.model('List');
const User = mongoose.model('User');

exports.list = (req, res) => {

    //TODO: add X-Total-Count header
    //TODO: add X-Page header
    //TODO: add X-Per-Page header

    let listId = req.list;
    let page = (Number(req.query.p) > 0 ? Number(req.query.p) : 1) - 1;
    //TODO: use config for pagination defaults
    let perPage = (Number(req.query.pp) > 0 ? Number(req.query.pp) : 100);

    User.find({ 'lists': listId })
        //TODO: allow GET /users sorting override
        //TODO: test pagination
        .sort({'name': 1})
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
};