'use strict';

// External modules
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
        uuid: {
            type: String,
            trim: true,
            // TODO: test for unique uuid
            index: { unique: true },
            required: 'uuid cannot be blank'
        },
        createdOn: {
            type: Date,
            default: Date.now,
            index: true
        },
        email: {
            type: String,
            trim: true,
            required: 'encryptedEmail cannot be blank'
        },
        lists: [{
            type: Schema.Types.ObjectId,
            ref: 'List'
        }]
    });

UserSchema.index({ "lists" : 1 , "createdOn" : 1});
mongoose.model('User', UserSchema);