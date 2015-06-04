'use strict';

/**
 * External Modules.
 */
const should = require('should');
const mongoose = require('mongoose');

/**
 * Internal Modules
 */

const app = require('../server');

const List = mongoose.model('List');
const User = mongoose.model('User');

/**
 * Module Globals
 */
let list;
let user;

/**
 * Unit tests
 */
describe('User Model Unit Tests:', function() {
    beforeEach(function(done) {

        list = new List ({
            name:   'An Example List',
            description: 'A description for the example list'
        });

        list.save(function (err, res) {
            user = new User ({
                uuid:     '02fd837c-0a96-11e5-a6c0-1697f925ec7b',
                name:     'User Name',
                email:    'email@example.com',
                marketingPreferences: {
                    allowFt: true,
                    allow3dParty: false
                },
                lists: [list._id]
            });
            done();
        });

    });

    describe('Method Save', function() {

        it('should be able to save without problems', function(done) {
            return user.save(function(err) {
                should.not.exist(err);
                done();
            });
        });

        it('should throw an error trying to save without name', function(done) {
            user.name = '';

            return user.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should throw an error trying to save without email', function(done) {
            user.email = '';

            return user.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should throw an error trying to save without uuid', function(done) {

            user.uuid = '';

            return user.save(function(err) {
                should.exist(err);
                done();
            });
        });

    });

    afterEach(function(done) {
        User.remove()
            .exec(function () {
                List.remove().exec(done);
            });
    });
});
