'use strict';

// Our modules
const app = require('../server');
const config = require('../config/config');
const tearDownDb = require('./utils/tearDownDb');

// External modules
const should = require('should');
const request = require('supertest');
const mongoose = require('mongoose');
const agent = request.agent(app);

// Models
const Metadata = mongoose.model('Metadata');

describe('The metadata by list method', () => {

    beforeEach(tearDownDb);

    it('lists the user members of the provided list', (done) => {

        const metadata = new Metadata({
          fields: ['test']
        });

        // Save the user
        metadata.save(() => {

            // Request users
              request(app).get('/users/metadata')
                .auth(config.authUser, config.authPassword)
                .end((req, res) => {

                    // Set assertion
                    res.body.fields.should.have.a.lengthOf(1);

                    // Call the assertion callback
                    done();
                });

        });

    });

    it('returns empty fields array if no metadata', (done) => {
      // Request users
      request(app).get('/users/metadata')
        .auth(config.authUser, config.authPassword)
        .end((req, res) => {

          // Set assertion
          res.body.fields.should.have.a.lengthOf(0);

          // Call the assertion callback
          done();
        });
    });

    afterEach((done) => {

        Metadata.remove().exec(() => {
          done();
        });

    });

});
