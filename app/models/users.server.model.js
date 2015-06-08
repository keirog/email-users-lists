'use strict';

// External modules
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    uuid: {
        type: String,
        trim: true,
        // TODO: test for unique uuid
        index: { unique: true },
        required: 'uuid cannot be blank'
    },
    name: {
        type: String,
        trim: true,
        required: 'name cannot be blank'
    },
    createdOn: {
        type: Date,
        default: Date.now,
        index: true
    },
    email: {
        type: String,
        trim: true,
        required: 'email cannot be blank'
    },
    marketingPreferences: {
        allowFt: Boolean,
        allow3dParty: Boolean
    },
    lists: [{
        type: Schema.Types.ObjectId,
        ref: 'List'
    }]
});

UserSchema.index({ "lists" : 1 , "createdOn" : 1});
UserSchema.plugin(encrypt, { encryptionKey: process.env.EMAIL_ENCRYPTION_KEY, signingKey: process.env.EMAIL_SIGNING_KEY, encryptedFields: ['email'] });

mongoose.model('User', UserSchema);