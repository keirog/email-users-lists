'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ListSchema = new Schema({
    identifier: {
        type: String,
        trim: true,
        index: true,
        unique: true,
        required: 'identifier cannot be blank'
    },
    name: {
        type: String,
        trim: true,
        required: 'name cannot be blank'
    },
    description: {
        type: String,
        trim: true
    }
});

mongoose.model('List', ListSchema);