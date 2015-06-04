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
            description: 'A description for the list list'
        });

        list.save((err, res) => {

            // Create a new user
            user = new User({
                uuid: '02fd837c-0a96-11e5-a6c0-1697f925ec7b',
                name: 'User Name',
                email: 'email@list.com',
                marketingPreferences: {
                    allowFt: true,
                    allow3dParty: false
                },
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
                        (users[0].name).should.match(user.name);
                        (users[0].uuid).should.match(user.uuid);
                        (users[0].email).should.match(user.email);
                        (users[0].lists).should.be.an.Array.with.lengthOf(user.lists.length);
                        (users[0].marketingPreferences).should.be.an.Object.with.property('allowFt');
                        (users[0].marketingPreferences).should.be.an.Object.with.property('allow3dParty');



                        // Call the assertion callback
                        done();

                    });
            });
    });


    it('should not be able to save a user if no name is provided', (done) => {
        // Invalidate name field
        user.name = '';

        // Save a new user
        agent.post('/users')
            .send(user)
            .expect(400)
            .end((userSaveErr, userSaveRes) => {

                // Set message assertion
                should.exist(userSaveRes);
                //TODO: (userSaveRes.body.message).should.match('Name cannot be blank');
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

                let newName = 'This is a different user';
                // Handle user save error
                if (userSaveErr) {
                    done(userSaveErr);
                }

                // Update user name
                user.name = newName;

                // Update an existing user
                agent.put('/users/' + userSaveRes.body._id)
                    .send(user)
                    .expect(200)
                    .end((userUpdateErr, userUpdateRes) => {

                        // Handle user update error
                        if (userUpdateErr) {
                            done(userUpdateErr);
                        }

                        // Set assertions
                        (userUpdateRes.body._id).should.equal(userSaveRes.body._id);
                        (userUpdateRes.body.name).should.match(newName);

                        // Call the assertion callback
                        done();
                    });
            });
    });

    it('should not be able to update a user deleting its name', (done) => {

        // Save a new user
        agent.post('/users')
            .send(user)
            .expect(200)
            .end((userSaveErr, userSaveRes) => {

                let newName = '';
                // Handle user save error
                if (userSaveErr) {
                    done(userSaveErr);
                }

                // Update user name
                user.name = newName;

                // Update an existing user
                agent.put('/users/' + userSaveRes.body._id)
                    .send(user)
                    .expect(400)
                    .end((userUpdateErr, userUpdateRes) => {

                        // Handle user update error
                        if (userUpdateErr) {
                            done(userUpdateErr);
                        }

                        // Set assertions
                        should.exist(userUpdateRes);
                        //TODO: (userUpdateRes.body.message).should.match('Name cannot be blank');

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

            request(app).get('/users/' + userObj._id)
                .end((req, res) => {

                    // Set assertion
                    res.body.should.be.an.Object.with.property('name', user.name);

                    // Call the assertion callback
                    done();

                });
        });
    });

    it('should return proper error for single user if an invalid _id is provided', (done) => {
        request(app).get('/users/test')
            .end((req, res) => {
                // Set assertion
                res.body.should.be.an.Object.with.property('message', 'User is invalid');

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
                agent.delete('/users/' + userSaveRes.body._id)
                    .send()
                    .expect(200)
                    .end((userDeleteErr, userDeleteRes) => {

                        // Handle user error
                        if (userDeleteErr) {
                            done(userDeleteErr);
                        }

                        // Set assertions
                        (userDeleteRes.body._id).should.equal(userSaveRes.body._id);

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