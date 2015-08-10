'use strict';

const Encryption = require('ft-encryption');
const algorithm = 'aes-256-ctr';
const config = require('./config');

let encryption = new Encryption(algorithm, config.unsubscribeSecret);

module.exports = encryption;