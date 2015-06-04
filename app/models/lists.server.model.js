'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ListSchema = new Schema({
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