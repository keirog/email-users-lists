'use strict';


// Our modules
const app = require('../server');

// External modules
const should = require('should');
const request = require('supertest');
const mongoose = require('mongoose');
const agent = request.agent(app);

// Models
const List = mongoose.model('List');
const User = mongoose.model('User');


// Module globals
let list, user;

// List routes tests
describe('User CRUD tests:', () => {

    beforeEach((done) => {

        // Create new list
        list = new List({
            name: 'An Example List',
            description: 'A description for the example list'
        });

        list.save((err, res) => {

            // Create a new user
            user = new User({
                uuid: '02fd837c-0a96-11e5-a6c0-1697f925ec7b',
                email: 'email@list.com',
                lists: [res._id]
            });

            done();

        });

    });

    it('should be able to save a user', (done) => {

        // Save a new user
        agent.post('/users')
            .send(user)
            .expect(200)
            .end((userSaveErr) => {

                // Handle user save error
                if (userSaveErr) {
                    done(userSaveErr);
                }

                // Get a list of users
                agent.get('/users')
                    .end((userGetErr, userGetRes) => {

                        // Handle users get error
                        if (userGetErr) {
                            done(userGetErr);
                        }

                        // Get users list
                        let users = userGetRes.body;

                        // Set assertions
                        (users[0].uuid).should.match(user.uuid);
                        (users[0].email).should.match(user.email);
                        (users[0].lists).should.be.an.Array.with.lengthOf(user.lists.length);

                        // Call the assertion callback
                        done();

                    });
            });
    });


    it('should not be able to save a user if no email is provided', (done) => {
        // Invalidate email field
        user.email = '';

        // Save a new user
        agent.post('/users')
            .send(user)
            .expect(400)
            .end((userSaveErr, userSaveRes) => {

                // Set message assertion
                should.exist(userSaveRes);
                //TODO: (userSaveRes.body.message).should.match('Email cannot be blank');
                // Handle user save error
                done(userSaveErr);

            });
    });

    it('should be able to update a user', (done) => {

        // Save a new user
        agent.post('/users')
            .send(user)
            .expect(200)
            .end((userSaveErr, userSaveRes) => {

                let newEmail = 'This is a different email';
                // Handle user save error
                if (userSaveErr) {
                    done(userSaveErr);
                }

                // Update user email
                user.email = newEmail;

                // Update an existing user
                agent.put('/users/' + userSaveRes.body.uuid)
                    .send(user)
                    .expect(200)
                    .end((userUpdateErr, userUpdateRes) => {

                        // Handle user update error
                        if (userUpdateErr) {
                            done(userUpdateErr);
                        }

                        // Set assertions
                        (userUpdateRes.body._id).should.equal(userSaveRes.body._id);
                        (userUpdateRes.body.uuid).should.equal(userSaveRes.body.uuid);
                        (userUpdateRes.body.email).should.match(newEmail);

                        // Call the assertion callback
                        done();
                    });
            });
    });

    it('should not be able to update a user deleting its email', (done) => {

        // Save a new user
        agent.post('/users')
            .send(user)
            .expect(200)
            .end((userSaveErr, userSaveRes) => {

                let newEmail = '';
                // Handle user save error
                if (userSaveErr) {
                    done(userSaveErr);
                }

                // Update user email
                user.email = newEmail;

                // Update an existing user
                agent.put('/users/' + userSaveRes.body.uuid)
                    .send(user)
                    .expect(400)
                    .end((userUpdateErr, userUpdateRes) => {

                        // Handle user update error
                        if (userUpdateErr) {
                            done(userUpdateErr);
                        }

                        // Set assertions
                        should.exist(userUpdateRes);
                        //TODO: (userUpdateRes.body.message).should.match('Email cannot be blank');

                        // Call the assertion callback
                        done();
                    });
            });
    });

    it('should be able to get a list of users', (done) => {
        // Create new user model instance
        let userObj = new User(user);

        // Save the user
        userObj.save(() => {

            // Request users
            request(app).get('/users')
                .end((req, res) => {

                    // Set assertion
                    res.body.should.be.an.Array.with.lengthOf(1);

                    // Call the assertion callback
                    done();
                });

        });
    });


    it('should be able to get a single user', (done) => {
        // Create new user model instance
        let userObj = new User(user);

        // Save the user
        userObj.save(() => {

            request(app).get('/users/' + userObj.uuid)
                .end((req, res) => {

                    // Set assertion
                    res.body.should.be.an.Object.with.property('email', user.email);

                    // Call the assertion callback
                    done();

                });
        });
    });

    it('should return a 404 for single user if an invalid uuid is provided', (done) => {
        request(app).get('/users/test')
            .end((req, res) => {
                // Set assertion
                res.body.should.be.an.Object.with.property('message', 'User not found');

                // Call the assertion callback
                done();
            });
    });

    it('should be able to delete a user', (done) => {

        // Save a new user
        agent.post('/users')
            .send(user)
            .expect(200)
            .end((userSaveErr, userSaveRes) => {

                // Handle user save error
                if (userSaveErr) {
                    done(userSaveErr);
                }

                // Delete an existing user
                agent.delete('/users/' + userSaveRes.body.uuid)
                    .send()
                    .expect(200)
                    .end((userDeleteErr, userDeleteRes) => {

                        // Handle user error
                        if (userDeleteErr) {
                            done(userDeleteErr);
                        }

                        // Set assertions
                        (userDeleteRes.body._id).should.equal(userSaveRes.body._id);
                        (userDeleteRes.body.uuid).should.equal(userSaveRes.body.uuid);

                        // Call the assertion callback
                        done();
                    });
            });
    });

    it('allows to specify the maximum number of items returned', (done) => {

        // Create new user model instance
        let userObj = new User(user);

        // Create a new user
        let user2Obj = new User({
                uuid: '849f3554-0acf-11e5-a6c0-1697f925ec7b',
                email: 'email@example.com',
                lists: []
        });

        // Save the user
        userObj.save(() => {

            user2Obj.save(() => {

                // Request users
                request(app).get('/users?pp=1')
                    .end((req, res) => {

                        // Set assertion
                        res.body.should.be.an.Array.with.lengthOf(1);

                        // Call the assertion callback
                        done();
                    });

            });
        });

    });

    it('allows to specify the a specific pagination returned', (done) => {


        // Create new user model instance
        let userObj = new User(user);

        // Create a new user
        let user2Obj = new User({
            uuid: '849f3554-0acf-11e5-a6c0-1697f925ec7b',
            email: 'email@example.com',
            lists: []
        });

        // Save the user
        userObj.save(() => {

            user2Obj.save(() => {

                // Request users
                request(app).get('/users?pp=1&p=2')
                    .end((req, res) => {

                        // Set assertion
                        res.body.should.be.an.Array.with.lengthOf(1);

                        // Call the assertion callback
                        done();
                    });
            });

        });

    });

    afterEach((done) => {

        User.remove().exec(() => {
            List.remove().exec(done);
        });

    });

});