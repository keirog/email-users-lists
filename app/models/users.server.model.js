'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
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

mongoose.model('User', UserSchema);