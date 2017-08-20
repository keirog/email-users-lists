'use strict';

// External modules
const should = require('should');
const mongoose = require('mongoose');
const tearDownDb = require('./utils/tearDownDb');

// Internal Modules
const app = require('../server');
const List = mongoose.model('List');

/**
 * Globals
 */
var list;

/**
 * Unit tests
 */
describe('List Model Unit Tests:', function() {
    beforeEach(function (done) {
        tearDownDb(() => {
            list = new List ({
                externalIds: {
                    eBay: "234134234234"
                },
                name:   'An Example List',
                description: 'A description for the list list'
            });
            done();
        });
    });

    describe('Method Save', function() {
        it('should be able to save without problems', function(done) {
            list.save(function(err) {
                should.not.exist(err);
                done();
            });
        });

        it('should be able to show an error trying to save without name', function(done) {
            list.name = '';

            list.save(function(err) {
                should.exist(err);
                done();
            });
        });
    });

    afterEach(function(done) {
        List.remove().exec(done);
    });
});
