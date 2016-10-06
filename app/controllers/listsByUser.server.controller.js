'use strict';

// External modules
const mongoose = require('mongoose');
const _ = require('lodash');
const extend = require('extend');

// Internal modules
const listCtrl = require('./lists.server.controller');
const crypto = require('../utils/crypto.server.utils');
const unsubscribeEncryption = require('../../config/unsubscribeEncryption');

// Models
const List = mongoose.model('List');
const User = mongoose.model('User');

exports.list = (req, res) => {

    // If we get here, we must have a valid user
    let user = req.user;

    User.findOne({uuid: user.uuid})
        .populate('lists.list')
        .exec((err, populatedUser) => {

            /* istanbul ignore if */
            if (err) {

                return res.status(400).json({
                    message: err
                });
            }

            return res.json(populatedUser.lists);
        });
};

exports.add = (req, res) => {

    //We have a valid user uuid and list _id
    let user = req.user;
    let bodyListRelationship = req.body;
    let listId = bodyListRelationship.list;

    listCtrl.listById(req, res, addToList, listId);

    function addToList() {
        //To be here, we must have a valid list_id and user uuid
        //We must check if the list id is already in the lists array

        // Remove the list from the user (if it is already there). We do not want duplicates.
        let userLists = user.lists.filter((listRelationship) => {
            return (listRelationship.list.toString() !== listId);
        });

        // Create new List relationship
        let newRelationship = {
            list: listId
        };

        newRelationship.frequency = bodyListRelationship.frequency;
        newRelationship.products = bodyListRelationship.products;
        newRelationship.unsubscribeKey = unsubscribeEncryption.encrypt({
            uuid: user.uuid,
            listId: listId
        });

        // Add the list to the user
        userLists.push(newRelationship);

        user.lists = userLists;

        // Save a copy of the decrypted user that will be used in the response
        let decryptedUser = JSON.parse(JSON.stringify(user));

        // At this point the emails have been decrypted. We do not want that!
        user.email = crypto.encrypt(user.email);

        // Create updated user
        let  updatedUser = user.toObject();

        // Delete _id property
        delete updatedUser._id;

        // Update
        User.update({uuid: updatedUser.uuid}, updatedUser, { runValidators: true }, (updateErr) => {

            /* istanbul ignore if */
            if (updateErr) {
                return res.status(400).json({
                    //TODO: errorHandler.getErrorMessage(err)
                    message: updateErr
                });
            }
            else {

                res.json(decryptedUser.lists);
            }
        });

    }
};

exports.delete = (req, res) => {

    //We have a valid user uuid and list _id
    let user = req.user;
    let list = req.list;
    let listId = list._id;

    // Remove the list from the user
    user.lists = _.reject(user.lists, { list: listId });

    // Save a copy of the decrypted user that will be used in the response
    let decryptedUser = JSON.parse(JSON.stringify(user));

    // At this point the emails have been decrypted. We do not want that!
    user.email = crypto.encrypt(user.email);

    // Create updated user
    let  updatedUser = user.toObject();

    // Delete _id property
    delete updatedUser._id;

    // Update
    User.update({uuid: updatedUser.uuid}, updatedUser, { runValidators: true }, (updateErr) => {

        /* istanbul ignore if */
        if (updateErr) {
            return res.status(400).json({
                //TODO: errorHandler.getErrorMessage(updateErr)
                message: updateErr
            });
        }
        else {
            res.json(decryptedUser.lists);
        }
    });
};

exports.deleteAll = (req, res) => {

    //We have a valid user uuid and list _id
    let user = req.user;

    // Remove the list from the user
    user.lists = [];

    // Save a copy of the decrypted user that will be used in the response
    let decryptedUser = JSON.parse(JSON.stringify(user));

    // At this point the emails have been decrypted. We do not want that!
    user.email = crypto.encrypt(user.email);

    // Create updated user
    let  updatedUser = user.toObject();

    // Delete _id property
    delete updatedUser._id;

    // Update
    User.update({uuid: updatedUser.uuid}, updatedUser, { runValidators: true }, (updateErr) => {

        /* istanbul ignore if */
        if (updateErr) {
            return res.status(400).json({
                //TODO: errorHandler.getErrorMessage(updateErr)
                message: updateErr
            });
        }
        else {
            res.json(decryptedUser.lists);
        }
    });
};
