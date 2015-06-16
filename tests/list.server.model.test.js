'use strict';

// External modules
const should = require('should');
const mongoose = require('mongoose');

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
    beforeEach(function(done) {
        list = new List ({
            identifier: '86547b0a-1427-11e5-b60b-1697f925ec7b',
            name:   'An Example List',
            description: 'A description for the list list'
        });
        done();
    });

    describe('Method Save', function() {
        it('should be able to save without problems', function(done) {
            return list.save(function(err) {
                should.not.exist(err);
                done();
            });
        });

        it('should be able to show an error trying to save without name', function(done) {
            list.name = '';

            return list.save(function(err) {
                should.exist(err);
                done();
            });
        });
    });

    afterEach(function(done) {
        List.remove().exec(done);
    });
});