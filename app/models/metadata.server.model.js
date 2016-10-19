'use strict';

// External modules
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const metadataSchema = new Schema({
  fields: Array
});

mongoose.model('Metadata', metadataSchema, 'metadata');
