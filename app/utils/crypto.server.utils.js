'use strict';

const crypto = require("crypto");
const config = require('../../config/config');

const algorithm = 'aes-256-ctr';
const password = config.emailSigningKey;
const ivPassword = config.encryptionKey;
const hmacKey = config.hmacKey; 
const IV_LENGTH = 16;

module.exports.encrypt = (text) => {
    
    text = text.toLowerCase();

    const cipher = crypto.createCipher(algorithm,password);

    let crypted = cipher.update(text, 'utf8', 'hex');

    crypted += cipher.final('hex');

    return crypted;
};

module.exports.decrypt = (text) => {

    const decipher = crypto.createDecipher(algorithm,password);

    let dec = decipher.update(text, 'hex', 'utf8');

    dec += decipher.final('utf8');

    return dec;

};

module.exports.ivEncrypt = (text) => {
  text = text.toLowerCase();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(algorithm, ivPassword, iv);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return `${iv.toString('hex')}:${crypted}`;
};

module.exports.hmacDigest = (text) => {
  return crypto.createHmac('sha256', hmacKey).update(text).digest('hex');
};
