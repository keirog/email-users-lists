'use strict';

// External modules
const mongoose = require('mongoose');
const extend = require('extend');

const listCtrl = require('./lists.server.controller');

// Models
const List = mongoose.model('List');
const User = mongoose.model('User');

exports.list = (req, res) => {

    let user = req.user;

    if(!user) {
        return res.status(400).send({
            message: 'Invalid user provided'
        });
    }

    User.findOne({uuid: user.uuid})
        .populate('lists')
        .exec((err, populatedUser) => {

            /* istanbul ignore if */
            if (err) {

                return res.status(400).send({
                    //TODO: errorHandler.getErrorMessage(err)
                    message: err
                });
            }
            else {
                res.json(populatedUser.lists);
            }
        });
};

exports.add = (req, res) => {
    let user = req.user;
    let listId = req.body._id;
    if(!user) {
        return res.status(400).send({
            message: 'Invalid user uuid provided'
        });
    }
    else {
        listCtrl.listById(req, res, addToList, listId);
    }

    function addToList() {
        //To be here, we must have a valid list_id and user uuid
        //We must check if the list id is already in the lists array

        let listIndex = user.lists.indexOf(listId);

        // The user is already a member of the list
        if (listIndex >= 0) {
            return res.json(user);
        }
        else {
            user.lists.push(listId);

            user.save((saveErr) => {

                /* istanbul ignore if */
                if (saveErr) {
                    return res.status(400).send({
                        //TODO: errorHandler.getErrorMessage(err)
                        message: saveErr
                    });
                }
                else {
                    res.json(user);
                }
            });

        }
    }
};

exports.delete = (req, res) => {

    let user = req.user;
    let list = req.list;

    if(!user) {
        return res.status(400).send({
            message: 'Invalid user uuid provided'
        });
    }
    else { //We have a valid user uuid and list _id

        let listIndex = user.lists.indexOf(list._id);

        if (listIndex < 0) {
            return res.status(400).send({
                message: 'The user is not a member of the specified list'
            });
        }
        else {

            user.lists.splice(listIndex, 1);
            user.save((saveErr) => {
                /* istanbul ignore if */
                if (saveErr) {
                    return res.status(400).send({
                        //TODO: errorHandler.getErrorMessage(saveErr)
                        message: saveErr
                    });
                }
                else {
                    res.json(user);
                }
            });
        }
    }



};

