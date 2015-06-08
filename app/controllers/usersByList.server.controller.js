'use strict';

// External modules
const mongoose = require('mongoose');

// Models
const List = mongoose.model('List');
const User = mongoose.model('User');

exports.list = (req, res) => {

    //TODO: test headers

    let listId = req.list;
    let page = (Number(req.query.p) > 0 ? Number(req.query.p) : 1) - 1;
    //TODO: use config for pagination defaults
    let perPage = (Number(req.query.pp) > 0 ? Number(req.query.pp) : 100);

    res.header('X-Page', page + 1);
    res.header('X-Per-Page', perPage);

    User.count({'lists': listId }, (countErr, count) => {

        res.header('X-Total-Count', count);

        User.find({'lists': listId})
            //TODO: allow GET /users sorting override
            //TODO: test pagination
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