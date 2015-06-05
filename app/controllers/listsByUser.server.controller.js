'use strict';

// External modules
const mongoose = require('mongoose');

// Internal modules
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
            // Add the list to the user
            user.lists.push(listId);
            // Create updated user
            let  updatedUser = user.toObject();
            console.log(updatedUser);
            // Delete _id property
            delete updatedUser._id;
            // Update
            User.update({uuid: updatedUser.uuid}, updatedUser, (saveErr) => {

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
            // Remove the list from the user
            user.lists.splice(listIndex, 1);
            // Create updated user
            let  updatedUser = user.toObject();
            // Delete _id property
            delete updatedUser._id;
            // Update
            User.update({uuid: updatedUser.uuid}, updatedUser, (saveErr) => {
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

