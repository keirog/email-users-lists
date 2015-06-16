'use strict';

require('dotenv').load({silent: true});
const should = require('should');

const encrypt = require('../app/utils/crypto.server.utils').encrypt;
const decrypt = require('../app/utils/crypto.server.utils').decrypt;

describe('The crypto util', () => {

    it('is reversible', (done) => {

        let message = 'exampleemail@example.com';
        decrypt(encrypt(message)).should.match(message);
        done();

    });

});