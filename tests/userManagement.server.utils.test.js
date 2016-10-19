'use strict';

const should = require('should');
const mongoose = require('mongoose');


const User = mongoose.model('User');


const manageUsers = require('../app/utils/userManagement.server.utils');

let user;

describe('The manageExpiration util', () => {

    beforeEach((done) => {

        // Create a new user
        user = {
            uuid: '02fd837c-0a96-11e5-a6c0-1697f925ec7b',
            email: 'abc@example.com',
            firstName: 'Bob',
            lastName: 'Dylan',
            lists: [],
            automaticallySuppressed: true,
            manuallySuppressed: false,
            expiredUser:{
              value: false
            }
        };

        done();

    });

    it('expires a user if its email address ends with a blacklisted domain', (done) => {

        user.email = 'abc@expired.com';

        manageUsers.manageExpiration(user);

        (user.expiredUser.value).should.be.true();


        done();
    });

    it('doesn\'t expire a user if its email address ends with a not blacklisted domain', (done) => {

        manageUsers.manageExpiration(user);

        (user.expiredUser.value).should.be.false();

        done();
    });

    it('removes the suppression tag if the email address changed', (done) => {

        let userUpdate = { email: 'abcd@example.com' };

        manageUsers.manageSuppression(user, userUpdate);

        (user.automaticallySuppressed).should.be.false();


        done();
    });

    it('doesn\'t remove the suppression tag if the email address did not change', (done) => {

        let userUpdate = { email: 'abc@example.com' };

        manageUsers.manageSuppression(user, userUpdate);

        (user.automaticallySuppressed).should.be.true();

        done();
    });


});
