'use strict';

// External modules
const mongoose = require('mongoose');
const immutablePlugin = require('mongoose-immutable');

const Schema = mongoose.Schema;

const listRelationshipSchema = new Schema({
        list: {
            type: Schema.Types.ObjectId,
            ref: 'List',
            index: true
        },
        frequency: {
            type: String,
            trim: true
        },
        unsubscribeKey: {
            type: String,
            required: 'Missing the unsubscribeKey'
        },
        products: [{
            type: String,
            trim: true
        }]
    },
    {
        _id : false,
        read: 'secondaryPreferred'
    });

const userSchema = new Schema({
        uuid: {
            type: String,
            trim: true,
            index: {unique: true, sparse: true},
            immutable: true
        },
        firstName: {
            type: String,
            trim: true
        },
        lastName: {
            type: String,
            trim: true
        },
        createdOn: {
            type: Date,
            default: Date.now
        },
        expired: {
            type: Boolean,
            default: false,
            index: true
        },
        manuallySuppressed: {
            type: Boolean,
            default: false,
            index: true
        },
        automaticallySuppressed: {
            type: Boolean,
            default: false,
            index: true
        },
        externallySuppressed: {
            type: Boolean,
            default: false,
            index: true
        },
        email: {
            type: String,
            trim: true,
            index: { unique: true },
            required: 'email cannot be blank'
        },
        lists: [listRelationshipSchema]
    });

userSchema.plugin(immutablePlugin);

//We always want emails to be encrypted
userSchema.path('email').validate((value) => {
        return /^[0-9A-F]+$/i.test(value);
    }, 'The email to save is not encrypted');

userSchema.index({  externallySuppressed: 1, automaticallySuppressed: 1, manuallySuppressed: 1, expired: 1, "lists.list": 1 });
userSchema.index({  externallySuppressed: 1, automaticallySuppressed: 1, manuallySuppressed: 1, expired: 1 });

mongoose.model('User', userSchema);
