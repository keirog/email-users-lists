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
let list1, list2, user;

describe('The lists by user methods', () => {

    beforeEach((done) => {

        // Create new list
        list1 = new List({
            name: 'An Example List',
            description: 'A description for the example list'
        });

        // Create another list
        list2 = new List({
            name: 'An Second Example List',
            description: 'A description for the second example list'
        });

        list1.save((errSave1, resSave1) => {

            list2.save(() => {

                // Create a new user
                user = new User({
                    uuid: '02fd837c-0a96-11e5-a6c0-1697f925ec7b',
                    email: 'email@list.com',
                    lists: [resSave1._id]
                });

                done();

            });

        });

    });

    it('should be able to get a populated list of lists for the provided user', (done) => {
        // Create new user model instance
        let userObj = new User(user);

        userObj.save(() => {
            // Request users
            request(app).get('/users/' + userObj.uuid + '/lists')
                .end((req, res) => {
                    // Set assertion
                    res.body.should.be.an.Array.with.lengthOf(1);

                    // Call the assertion callback
                    done();
                });

        });
    });

    it('should return a proper error if the wrong user uuid is provided', (done) => {
        // Create new user model instance
        let userObj = new User(user);

        userObj.save(() => {
            // Request users
            request(app).get('/users/' + 'wrongUuid' + '/lists')
                .end((req, res) => {
                    // Set assertion
                    res.status.should.match(400);
                    res.body.should.be.an.Object.with.property('message', 'Invalid user provided');
                    // Call the assertion callback
                    done();
                });

        });
    });

    it('should be able to remove a list from a user', (done) => {
        // Save a new user
        agent.post('/users')
            .send(user)
            .expect(200)
            .end((userSaveErr, userSaveRes) => {

                // Handle list save error
                if (userSaveErr) {
                    return done(userSaveErr);
                }

                // Delete an existing list
                agent.delete('/users/' + userSaveRes.body.uuid + '/lists/' + list1._id)
                    .send()
                    .expect(200)
                    .end((listDeleteErr, listDeleteRes) => {

                        // Handle list error
                        if (listDeleteErr) {
                            return done(listDeleteErr);
                        }

                        // Set assertions
                        listDeleteRes.body.lists.should.be.an.Array.with.lengthOf(0);
                        //listDeleteRes.body.should.be.an.Object.with.property('message', 'Invalid user uuid provided');

                        // Call the assertion callback
                        done();
                    });
            });
    });

    it('should return a proper error if the wrong user uuid is provided when deleting', (done) => {
        // Save a new user
        agent.post('/users')
            .send(user)
            .expect(200)
            .end((userSaveErr, userSaveRes) => {

                // Handle list save error
                if (userSaveErr) {
                    return done(userSaveErr);
                }

                // Provide the wrong user uuid
                agent.delete('/users/' + 'wrongUuid' + '/lists/' + list1._id)
                    .send()
                    .expect(400)
                    .end((listDeleteErr, listDeleteRes) => {

                        // Handle list error
                        if (listDeleteErr) {
                            return done(listDeleteErr);
                        }

                        // Set assertions
                        listDeleteRes.body.should.be.an.Object.with.property('message', 'Invalid user uuid provided');

                        // Call the assertion callback
                        done();
                    });
            });
    });

    it('should return a proper error if the wrong list id is provided', (done) => {
        // Save a new user
        agent.post('/users')
            .send(user)
            .expect(200)
            .end((userSaveErr, userSaveRes) => {

                // Handle list save error
                if (userSaveErr) {
                    return done(userSaveErr);
                }

                // Provide the wrong list Id
                agent.delete('/users/' + userSaveRes.body.uuid + '/lists/' + 'wrongId')
                    .send()
                    .expect(400)
                    .end((listDeleteErr, listDeleteRes) => {

                        // Handle list error
                        if (listDeleteErr) {
                            return done(listDeleteErr);
                        }

                        // Set assertions
                        listDeleteRes.body.should.be.an.Object.with.property('message', 'List is invalid');

                        // Call the assertion callback
                        done();
                    });
            });
    });

    it('should return a proper error if the user is not linked to the list', (done) => {
        // Save a new user
        agent.post('/users')
            .send(user)
            .expect(200)
            .end((userSaveErr, userSaveRes) => {

                // Handle list save error
                if (userSaveErr) {
                    return done(userSaveErr);
                }

                // Provide the wrong list Id
                agent.delete('/users/' + userSaveRes.body.uuid + '/lists/' + list2._id)
                    .send()
                    .expect(400)
                    .end((listDeleteErr, listDeleteRes) => {

                        // Handle list error
                        if (listDeleteErr) {
                            return done(listDeleteErr);
                        }

                        // Set assertions
                        listDeleteRes.body.should.be.an.Object.with.property('message', 'The user is not a member of the specified list');

                        // Call the assertion callback
                        done();
                    });
            });
    });


    it('should be able to add a user to a list', (done) => {
        // Create new user model instance
        let userObj = new User(user);

        userObj.save(() => {
            agent.post('/users/' + user.uuid + '/lists')
                .send(list2)
                //.expect(200)
                .end((listSaveErr) => {

                    // Handle list save error
                    if (listSaveErr) {
                        done(listSaveErr);
                    }

                    // Get a list of lists
                    agent.get('/users/' + user.uuid + '/lists')
                        .end((listGetErr, listGetRes) => {

                            // Handle lists get error
                            if (listGetErr) {
                                done(listGetErr);
                            }

                            // Get lists list
                            let lists = listGetRes.body;

                            // Set assertions
                            lists.should.be.an.Array.with.lengthOf(2);
                            // Call the assertion callback
                            done();

                        });
                });
        });
    });

    it('should return a proper error if the wrong user uuid is provided when adding', (done) => {
        // Save a new user
        agent.post('/users')
            .send(user)
            .expect(200)
            .end((userSaveErr, userSaveRes) => {

                // Handle list save error
                if (userSaveErr) {
                    return done(userSaveErr);
                }

                // Provide the wrong user uuid
                agent.post('/users/' + 'wrongUuid' + '/lists')
                    .send(list2)
                    .expect(400)
                    .end((listDeleteErr, listDeleteRes) => {

                        // Handle list error
                        if (listDeleteErr) {
                            return done(listDeleteErr);
                        }

                        // Set assertions
                        listDeleteRes.body.should.be.an.Object.with.property('message', 'Invalid user uuid provided');

                        // Call the assertion callback
                        done();
                    });
            });
    });

    it('should not throw an error if the user is already a member of the list provided', (done) => {
        // Create new user model instance
        let userObj = new User(user);

        userObj.save(() => {
            agent.post('/users/' + user.uuid + '/lists')
                .send(list1)
                //.expect(200)
                .end((listSaveErr) => {

                    // Handle list save error
                    if (listSaveErr) {
                        done(listSaveErr);
                    }

                    // Get a list of lists
                    agent.get('/users/' + user.uuid + '/lists')
                        .end((listGetErr, listGetRes) => {

                            // Handle lists get error
                            if (listGetErr) {
                                done(listGetErr);
                            }

                            // Get lists list
                            let lists = listGetRes.body;

                            // Set assertions
                            lists.should.be.an.Array.with.lengthOf(1);
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