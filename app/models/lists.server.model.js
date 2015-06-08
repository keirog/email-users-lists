'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ListSchema = new Schema({
    name: {
        type: String,
        trim: true,
        index: true,
        required: 'name cannot be blank'
    },
    description: {
        type: String,
        trim: true
    }
});

mongoose.model('List', ListSchema);