'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ListSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: 'name cannot be blank'
    },
    description: {
        type: String,
        trim: true
    },
    inactive: {
        type: Boolean,
        default: false,
        index: true
    },
    externalIds: {
        eBay: {
            type: String,
            trim: true
        }
    }
}, {
    read: 'secondaryPreferred'
});

mongoose.model('List', ListSchema);