'use strict';


// Our modules
const app = require('../server');
const crypto = require('../app/utils/crypto.server.utils');
const config = require('../config/config');
const tearDownDb = require('./utils/tearDownDb');

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

let email = 'user@email.com';

// List routes tests
describe('User CRUD tests:', () => {

  beforeEach((done) => {

    tearDownDb(() => {
      // Create new list
      list = new List({
        externalIds: {
          eBay: "234134234234"
        },
        name: 'An Example List',
        description: 'A description for the example list'
      });

      list.save((err, res) => {

        // Create a new user
        user = new User({
          uuid: '02fd837c-0a96-11e5-a6c0-1697f925ec7b',
          email: email,
          emailBlindIdx: email,
          firstName: 'Bob',
          lastName: 'Dylan',
          lists: [{
            list: res._id,
            unsubscribeKey: 'SOMEKEY2'
          }]
        });

        done();

      });
    });
  });

  it('should be able to save a user', (done) => {

    // Save a new user
    agent.post('/users')
      .auth(config.authUser, config.authPassword)
      .send(user)
      .expect(200)
      .end((userSaveErr) => {

        // Handle user save error
        if (userSaveErr) {
          done(userSaveErr);
        }

        // Get a list of users
        agent.get('/users')
          .auth(config.authUser, config.authPassword)
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
            (users[0].firstName).should.match(user.firstName);
            (users[0].lastName).should.match(user.lastName);

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
      .auth(config.authUser, config.authPassword)
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

  it('should be able to patch a user', (done) => {

    // Save a new user
    agent.post('/users')
      .auth(config.authUser, config.authPassword)
      .send(user)
      .expect(200)
      .end((userSaveErr, userSaveRes) => {

        let newEmail = 'this is a different email';
        // Handle user save error
        if (userSaveErr) {
          done(userSaveErr);
        }

        // Update user email
        let updateObj = {
          uuid: user.uuid,
          email: newEmail
        };

        // Update an existing user
        agent.patch('/users/' + userSaveRes.body.uuid)
          .auth(config.authUser, config.authPassword)
          .send(updateObj)
          .expect(200)
          .end((userUpdateErr, userUpdateRes) => {

            // Handle user update error
            if (userUpdateErr) {
              done(userUpdateErr);
            }

            // Set assertions
            (userUpdateRes.body.uuid).should.match(userSaveRes.body.uuid);
            (userUpdateRes.body.email).should.match(newEmail);
            (userUpdateRes.body.firstName).should.match(user.firstName);
            (userUpdateRes.body.lastName).should.match(user.lastName);

            // Call the assertion callback
            done();
          });
      });
  });

  it('should not be able to patch a user deleting its email', (done) => {

    // Save a new user
    agent.post('/users')
      .auth(config.authUser, config.authPassword)
      .send(user)
      .expect(200)
      .end((userSaveErr, userSaveRes) => {

        let newEmail = '';
        // Handle user save error
        if (userSaveErr) {
          return done(userSaveErr);
        }

        // Update user email
        let updateObj = {
          uuid: user.uuid,
          email: newEmail
        };

        // Update an existing user
        agent.patch('/users/' + userSaveRes.body.uuid)
          .auth(config.authUser, config.authPassword)
          .send(updateObj)
          .expect(400)
          .end((userUpdateErr, userUpdateRes) => {

            // Handle user update error
            if (userUpdateErr) {
              return done(userUpdateErr);
            }

            // Set assertions
            should.exist(userUpdateRes.body);
            //TODO: (userUpdateRes.body.message).should.match('Email cannot be blank');

            // Call the assertion callback
            done();
          });
      });
  });

  it('should throw return an error when  trying to patch the user-lists relationships', (done) => {

    // Save a new user
    agent.post('/users')
      .auth(config.authUser, config.authPassword)
      .send(user)
      .expect(200)
      .end((userSaveErr, userSaveRes) => {

        // Handle user save error
        if (userSaveErr) {
          done(userSaveErr);
        }

        // Update user email
        let updateObj = {
          uuid: user.uuid,
          lists: []
        };

        // Update an existing user
        agent.patch('/users/' + userSaveRes.body.uuid)
          .auth(config.authUser, config.authPassword)
          .send(updateObj)
          .expect(403)
          .end((userUpdateErr, userUpdateRes) => {

            // Handle user update error
            if (userUpdateErr) {
              done(userUpdateErr);
            }

            // Set assertions
            should.exist(userUpdateRes.body);
            (userUpdateRes.body.message).should.match('Forbidden. Lists cannot be edited via this method');

            // Call the assertion callback
            done();
          });
      });

  });

  it('should be able to update one user searched by uuid', (done) => {

    // Save a new user
    agent.post('/users')
      .auth(config.authUser, config.authPassword)
      .send(user)
      .expect(200)
      .end((userSaveErr, userSaveRes) => {

        // Handle user save error
        if (userSaveErr) {
          done(userSaveErr);
        }

        let updateObj = {
          key: {
            uuid: user.uuid
          },
          user: {
            suppressedMarketing: {
              value: true,
              reason: 'some reason'
            }
          }
        };

        // Update an existing user
        agent.post('/users/update-one')
          .auth(config.authUser, config.authPassword)
          .send(updateObj)
          .expect(200)
          .end((userUpdateErr, userUpdateRes) => {

            // Handle user update error
            if (userUpdateErr) {
              done(userUpdateErr);
            }

            // Set assertions
            (userUpdateRes.body.uuid).should.match(userSaveRes.body.uuid);
            (userUpdateRes.body.suppressedMarketing.value).should.be.true();
            (userUpdateRes.body.suppressedMarketing.reason).should.equal('some reason');

            // Call the assertion callback
            done();
          });
      });
  });

  it('should be able to update one user searched by email', (done) => {

    // Save a new user
    agent.post('/users')
      .auth(config.authUser, config.authPassword)
      .send(user)
      .expect(200)
      .end((userSaveErr, userSaveRes) => {

        // Handle user save error
        if (userSaveErr) {
          done(userSaveErr);
        }

        let updateObj = {
          key: {
            email
          },
          user: {
            suppressedMarketing: {
              value: true,
              reason: 'some reason'
            }
          }
        };

        // Update an existing user
        agent.post('/users/update-one')
          .auth(config.authUser, config.authPassword)
          .send(updateObj)
          .expect(200)
          .end((userUpdateErr, userUpdateRes) => {

            // Handle user update error
            if (userUpdateErr) {
              done(userUpdateErr);
            }

            // Set assertions
            (userUpdateRes.body.uuid).should.match(userSaveRes.body.uuid);
            (userUpdateRes.body.suppressedMarketing.value).should.be.true();
            (userUpdateRes.body.suppressedMarketing.reason).should.equal('some reason');

            // Call the assertion callback
            done();
          });
      });
  });

  it('should not be able to update user lists', (done) => {

    let updateObj = {
      key: {
        uuid: user.uuid
      },
      user: {
        lists: []
      }
    };

    // Update an existing user
    agent.post('/users/update-one')
      .auth(config.authUser, config.authPassword)
      .send(updateObj)
      .expect(403)
      .end((userUpdateErr, userUpdateRes) => {

        // Handle user update error
        if (userUpdateErr) {
          done(userUpdateErr);
        }

        // Set assertions
        (userUpdateRes.body).should.have.property('message');

        // Call the assertion callback
        done();
      });
  });

  it('throws an error if a key object is not provided', done => {

    let updateObj = {
      user: {
        suppressedMarketing: {
          value: true,
          reason: 'some reason'
        }
      }
    };

    // Update an existing user
    agent.post('/users/update-one')
      .auth(config.authUser, config.authPassword)
      .send(updateObj)
      .expect(400)
      .end((userUpdateErr, userUpdateRes) => {

        // Handle user update error
        if (userUpdateErr) {
          done(userUpdateErr);
        }

        // Set assertions
        (userUpdateRes.body).should.have.property('message');

        // Call the assertion callback
        done();
      });
  });

  it('throws an error if a user object is not provided', done => {

    let updateObj = {
      key: {
        uuid: user.uuid
      }
    };

    // Update an existing user
    agent.post('/users/update-one')
      .auth(config.authUser, config.authPassword)
      .send(updateObj)
      .expect(400)
      .end((userUpdateErr, userUpdateRes) => {

        // Handle user update error
        if (userUpdateErr) {
          done(userUpdateErr);
        }

        // Set assertions
        (userUpdateRes.body).should.have.property('message');

        // Call the assertion callback
        done();
      });
  });

  it('throws an error if key object doesnt contain an email or uuid', (done) => {

    let updateObj = {
      key: {
        firstName: 'Bob'
      },
      user: {
        suppressedMarketing: {
          value: true,
          reason: 'some reason'
        }
      }
    };

    // Update an existing user
    agent.post('/users/update-one')
      .auth(config.authUser, config.authPassword)
      .send(updateObj)
      .expect(400)
      .end((userUpdateErr, userUpdateRes) => {

        // Handle user update error
        if (userUpdateErr) {
          done(userUpdateErr);
        }

        // Set assertions
        (userUpdateRes.body).should.have.property('message');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to get a list of users', (done) => {

    //Encrypt the emails, since we are going to directly save the user
    user.email = crypto.encrypt(email);

    // Save the user
    user.save((saveErr) => {

      if (saveErr) {
        done(saveErr);
      }

      // Request users
      request(app).get('/users')
        .auth(config.authUser, config.authPassword)
        .end((req, res) => {

          // Set assertion
          res.body.should.have.a.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('searches users by email', (done) => {

    //Encrypt the emails, since we are going to directly save the user
    user.email = crypto.encrypt(email);
    user.emailBlindIdx = crypto.hmacDigest(email);

    // Save the user
    user.save((saveErr) => {

      if (saveErr) {
        done(saveErr);
      }

      agent.post('/users/search')
        .auth(config.authUser, config.authPassword)
        .send({email})
        .expect(200)
        .end((searchErr, searchRes) => {

          searchRes.body.should.have.a.lengthOf(1);
          done(searchErr);

        });

    });
  });

  it('searches invalid users by email', (done) => {

    //Encrypt the emails, since we are going to directly save the user
    user.email = crypto.encrypt(email);
    user.emailBlindIdx = crypto.hmacDigest(email);

    // Save the user
    user.save((saveErr) => {

      if (saveErr) {
        done(saveErr);
      }

      agent.post('/users/search?valid=false')
        .auth(config.authUser, config.authPassword)
        .send({email})
        .expect(200)
        .end((searchErr, searchRes) => {

          searchRes.body.should.have.a.lengthOf(0);
          done(searchErr);

        });

    });
  });

  it('should be able to get a single user', (done) => {

    //Encrypt the emails, since we are going to directly save the user
    user.email = crypto.encrypt(email);

    // Save the user
    user.save(() => {

      request(app).get('/users/' + user.uuid)
        .auth(config.authUser, config.authPassword)
        .end((req, res) => {

          // Set assertion
          res.body.should.have.a.property('email', email);
          res.body.should.have.a.property('firstName', user.firstName);
          res.body.should.have.a.property('lastName', user.lastName);

          // Call the assertion callback
          done();

        });
    });
  });

  it('should return a 404 for single user if an invalid uuid is provided', (done) => {
    request(app).get('/users/test')
      .auth(config.authUser, config.authPassword)
      .end((req, res) => {
        // Set assertion
        res.body.should.have.a.property('message', 'User not found');

        // Call the assertion callback
        done();
      });
  });

  it('allows to specify the maximum number of items returned', (done) => {

    //Encrypt the emails, since we are going to directly save the user
    user.email = crypto.encrypt(email);
    user.emailBlindIdx = crypto.hmacDigest(email);

    // Create new user model instance
    let userObj = new User(user);

    // Create a new user
    let user2Obj = new User({
      uuid: '849f3554-0acf-11e5-a6c0-1697f925ec7b',
      email: 'email@example.com',
      emailBlindIdx: 'email@example.com',
      lists: []
    });

    // Save the user
    userObj.save(() => {

      user2Obj.email = crypto.encrypt(user2Obj.email);


      user2Obj.save(() => {

        // Request users
        request(app).get('/users?pp=1')
          .auth(config.authUser, config.authPassword)
          .end((req, res) => {

            // Set assertion
            res.body.should.have.a.lengthOf(1);

            // Call the assertion callback
            done();
          });

      });
    });

  });

  it('allows to specify the a specific pagination returned', (done) => {


    //Encrypt the emails, since we are going to directly save the user
    user.email = crypto.encrypt(email);
    user.emailBlindIdx = crypto.hmacDigest(email);

    // Create new user model instance
    let userObj = new User(user);

    // Create a new user
    let user2Obj = new User({
      uuid: '849f3554-0acf-11e5-a6c0-1697f925ec7b',
      email: crypto.encrypt('user2@example.com'),
      emailBlindIdx: 'test@test.com',
      lists: []
    });

    // Save the user
    userObj.save(() => {

      user2Obj.email = crypto.encrypt(user2Obj.email);

      user2Obj.save(() => {

        // Request users
        request(app).get('/users?pp=1&p=2')
          .auth(config.authUser, config.authPassword)
          .end((req, res) => {

            // Set assertion
            res.body.should.have.a.lengthOf(1);

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
