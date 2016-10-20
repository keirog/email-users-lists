'use strict';

const should = require('should');
const mongoose = require('mongoose');


const User = mongoose.model('User');


const manageUsers = require('../app/utils/userManagement.server.utils');


describe('The manageExpiration util', () => {
    let user,
        reason = "reason";

    beforeEach((done) => {

        // Create a new user
        user = {
            uuid: '02fd837c-0a96-11e5-a6c0-1697f925ec7b',
            email: 'abc@example.com',
            firstName: 'Bob',
            lastName: 'Dylan',
            lists: [],
            suppressedNewsletter: { value: true, reason },
            suppressedMarketing: { value: false },
            suppressedRecommendation: { value: false },
            suppressedAccount: { value: false },
            expiredUser: { value: false }
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

        (user.suppressedNewsletter.value).should.be.false();
        (user.suppressedMarketing.value).should.be.false();
        (user.suppressedRecommendation.value).should.be.false();
        (user.suppressedAccount.value).should.be.false();

        done();
    });

    it('doesn\'t remove the suppression tag if the email address did not change', (done) => {

        let userUpdate = { email: 'abc@example.com' };

        manageUsers.manageSuppression(user, userUpdate);

        (user.suppressedNewsletter.value).should.be.true();
        (user.suppressedNewsletter.reason).should.equal(reason);

        done();
    });


});
