'use strict';

const crypto = require("crypto");
const config = require('../../config/config');

const algorithm = 'aes-256-ctr';
const password = config.encryptionKey;
const hmacKey = config.hmacKey; 
const IV_LENGTH = 16;

module.exports.decrypt = (text) => {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(password), iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

module.exports.encrypt = (text) => {
  text = text.toLowerCase();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(algorithm, password, iv);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return `${iv.toString('hex')}:${crypted}`;
};

module.exports.hmacDigest = (text) => {
  return crypto.createHmac('sha256', hmacKey).update(text).digest('hex');
};
