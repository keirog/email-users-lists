'use strict';

// External modules
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const listRelationshipSchema = new Schema({
        list: {
            type: Schema.Types.ObjectId,
            ref: 'List'
        },
        alternativeEmail: {
            type: String,
            trim: true
        },
        frequency: {
            type: String,
            trim: true
        },
        products: [{
            type: String,
            trim: true
        }]
    },
    {
        _id : false
    });

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
            required: 'email cannot be blank'
        },
        lists: [listRelationshipSchema]
    });

UserSchema.index({ "lists" : 1 , "createdOn" : 1});
mongoose.model('User', UserSchema);