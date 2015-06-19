'use strict';

// Our modules
const app = require('../server');
const config = require('../config/config');

// External modules
const should = require('should');
const request = require('supertest');
const mongoose = require('mongoose');
const agent = request.agent(app);

// Models
const List = mongoose.model('List');
const User = mongoose.model('User');
const crypto = require('../app/utils/crypto.server.utils');

// Module globals
let list, user1, user2;

describe('The users by list methods', () => {
    beforeEach((done) => {

        // Create new list
        list = new List({
            identifier: '86547b0a-1427-11e5-b60b-1697f925ec7b',
            name: 'An Example List',
            description: 'A description for the example list'
        });


        list.save((errListSave, resListSave) => {

            let email = crypto.encrypt('email@email.com');
            let alternativeEmail = crypto.encrypt('userByList@list.com');

            // Create a new user
            user1 = new User({
                uuid: '02fd837c-0a96-11e5-a6c0-1697f925ec7b',
                email: email,
                lists: [{
                    list: resListSave._id,
                    alternativeEmail: alternativeEmail,
                    frequency: 'immediate',
                    products: ['next']
                }]
            });

            user1.save(() => {
                // Create a new user
                user2 = new User({
                    uuid: '849f3554-0acf-11e5-a6c0-1697f925ec7b',
                    email: email,
                    lists: []
                });

                done();

            });

        });

    });

    it('lists the user members of the provided list', (done) => {

        // Create new user model instance
        let userObj = new User(user2);

        // Save the user
        userObj.save(() => {

            // Request users
            request(app).get('/lists/' + list._id + '/users')
                .auth(config.authUser, config.authPassword)
                .end((req, res) => {

                    // Set assertion
                    res.body.should.have.a.lengthOf(1);

                    // Call the assertion callback
                    done();
                });

        });

    });

    it('allows to specify the maximum number of items returned', (done) => {

        // Add the list to the second user
        user2.lists.push({list: list._id});

        // Create new user model instance
        let userObj = new User(user2);

        // Save the user
        userObj.save(() => {

            // Request users
            request(app).get('/lists/' + list._id + '/users?pp=1')
                .auth(config.authUser, config.authPassword)
                .end((req, res) => {

                    // Set assertion
                    res.body.should.have.a.lengthOf(1);

                    // Call the assertion callback
                    done();
                });

        });

    });

    it('allows to specify the a specific pagination returned', (done) => {

        // Add the list to the second user
        user2.lists.push({list: list._id});

        // Create new user model instance
        let userObj = new User(user2);

        // Save the user
        userObj.save(() => {

            // Request users
            request(app).get('/lists/' + list._id + '/users?pp=1&p=2')
                .auth(config.authUser, config.authPassword)
                .end((req, res) => {

                    // Set assertion
                    res.body.should.have.a.lengthOf(1);

                    // Call the assertion callback
                    done();
                });

        });

    });

    afterEach((done) => {

        User.remove().exec(() => {
            List.remove().exec(done);
        });

    });

});