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
let list1,
  list2,
  list3,
  user;

describe('The lists by user methods', () => {
  beforeEach((done) => {
    tearDownDb(() => {
            // Create new list
      list1 = new List({
        externalIds: {
          eBay: '234134234234',
        },
        name: 'An Example List',
        description: 'A description for the example list',
      });

            // Create another list
      list2 = new List({
        externalIds: {
          eBay: '35454535',
        },
        name: 'An Second Example List',
        description: 'A description for the second example list',
      });

            // Create another list
      list3 = new List({
        externalIds: {
          eBay: '76856856',
        },
        name: 'An Third Example List',
        description: 'A description for the third example list',
      });

      list1.save((errSave1, resSave1) => {
        list3.save((errSave3, resSave3) => {
          list2.save(() => {
            const email = crypto.encrypt('email@email.com');

                        // Create a new user
            user = new User({
              uuid: '02fd837c-0a96-11e5-a6c0-1697f925ec7b',
              email,
              lists: [{
                list: resSave1._id,
                unsubscribeKey: 'SOMEKEY6',
              }, {
                list: resSave3._id,
                unsubscribeKey: 'SOMEKEY7',
              }],
            });

            done();
          });
        });
      });
    });
  });

  it('should be able to get a populated list of lists for the provided user', (done) => {
        // Create new user model instance
    user.save(() => {
            // Request users
      request(app)
                .get(`/users/${user.uuid}/lists`)
                .auth(config.authUser, config.authPassword)
                .end((req, res) => {
                    // Set assertion
                  res.body.should.have.a.lengthOf(2);

                    // Call the assertion callback
                  done();
                });
    });
  });

  it('should return a proper error if the wrong user uuid is provided', (done) => {
        // Create new user model instance

    user.save((errSave) => {
      if (errSave) {
        done(errSave);
      }

            // Request users
      request(app).get('/users/' + 'wrongUuid' + '/lists')
                .auth(config.authUser, config.authPassword)
                .expect(404)
                .end((req, res) => {
                    // Set assertion
                  res.body.should.have.a.property('message', 'User not found');
                    // Call the assertion callback
                  done();
                });
    });
  });

  it('should be able to remove a list from a user', (done) => {
        // Save a new user
    agent.post('/users')
            .auth(config.authUser, config.authPassword)
            .send(user)
            .expect(200)
            .end((userSaveErr, userSaveRes) => {
                // Handle list save error
              if (userSaveErr) {
                return done(userSaveErr);
              }

                // Delete an existing list
              agent.delete(`/users/${userSaveRes.body.uuid}/lists/${list1._id}`)
                    .auth(config.authUser, config.authPassword)
                    .send()
                    .expect(200)
                    .end((listDeleteErr, listDeleteRes) => {
                        // Handle list error
                      if (listDeleteErr) {
                        return done(listDeleteErr);
                      }

                        // Set assertions
                      listDeleteRes.body.should.have.a.lengthOf(1);

                        // Call the assertion callback
                      done();
                    });
            });
  });

  it('should return a proper error if the wrong user uuid is provided when deleting', (done) => {
        // Save a new user
    agent.post('/users')
            .auth(config.authUser, config.authPassword)
            .send(user)
            .expect(200)
            .end((userSaveErr, userSaveRes) => {
                // Handle list save error
              if (userSaveErr) {
                return done(userSaveErr);
              }

                // Provide the wrong user uuid
              agent.delete(`${'/users/' + 'wrongUuid' + '/lists/'}${list1._id}`)
                    .auth(config.authUser, config.authPassword)
                    .send()
                    .expect(404)
                    .end((listDeleteErr, listDeleteRes) => {
                        // Handle list error
                      if (listDeleteErr) {
                        return done(listDeleteErr);
                      }

                        // Set assertions
                      listDeleteRes.body.should.have.a.property('message', 'User not found');

                        // Call the assertion callback
                      done();
                    });
            });
  });

  it('should return a proper error if the wrong list id is provided when deleting', (done) => {
        // Save a new user
    agent.post('/users')
            .auth(config.authUser, config.authPassword)
            .send(user)
            .expect(200)
            .end((userSaveErr, userSaveRes) => {
                // Handle list save error
              if (userSaveErr) {
                return done(userSaveErr);
              }

                // Provide the wrong list Id
              agent.delete(`/users/${userSaveRes.body.uuid}/lists/` + 'wrongId')
                    .auth(config.authUser, config.authPassword)
                    .send()
                    .expect(400)
                    .end((listDeleteErr, listDeleteRes) => {
                        // Handle list error
                      if (listDeleteErr) {
                        return done(listDeleteErr);
                      }

                        // Set assertions
                      listDeleteRes.body.should.have.a.property('message', 'List is invalid');

                        // Call the assertion callback
                      done();
                    });
            });
  });

  it('should not return an error if the user is not linked to the list when deleting', (done) => {
        // Save a new user
    agent.post('/users')
            .auth(config.authUser, config.authPassword)
            .send(user)
            .expect(200)
            .end((userSaveErr, userSaveRes) => {
                // Handle list save error
              if (userSaveErr) {
                return done(userSaveErr);
              }

                // Provide the wrong list Id
              agent.delete(`/users/${userSaveRes.body.uuid}/lists/${list2._id}`)
                    .auth(config.authUser, config.authPassword)
                    .send()
                    .expect(200)
                    .end((listDeleteErr, listDeleteRes) => {
                        // Handle list error
                      if (listDeleteErr) {
                        return done(listDeleteErr);
                      }

                        // Set assertions
                      listDeleteRes.body.should.have.a.lengthOf(2);

                        // Call the assertion callback
                      done();
                    });
            });
  });


  it('should be able to add a user to a list', (done) => {
    user.save((saveErr) => {
      if (saveErr) {
        done(saveErr);
      }

      agent.post(`/users/${user.uuid}/lists`)
                .auth(config.authUser, config.authPassword)
                .send({
                  list: list2._id,
                  alternativeEmail: 'testEmail@email.com',
                })
                .expect(200)
                .end((listAddErr) => {
                    // Handle list save error
                  if (listAddErr) {
                    done(listAddErr);
                  }

                    // Get a list of lists
                  agent.get(`/users/${user.uuid}/lists`)
                        .auth(config.authUser, config.authPassword)
                        // .expect(200)
                        .end((listGetErr, listGetRes) => {
                            // Handle lists get error
                          if (listGetErr) {
                            done(listGetErr);
                          }

                            // Get lists list
                          const lists = listGetRes.body;

                            // Set assertions
                          lists.should.have.a.lengthOf(3);
                            // Call the assertion callback
                          done();
                        });
                });
    });
  });

  it('should add a signUpType property to relationship', (done) => {
    user.save((saveErr) => {
      if (saveErr) {
        done(saveErr);
      }

      agent.post(`/users/${user.uuid}/lists`)
                .auth(config.authUser, config.authPassword)
                .send({
                  list: list2._id,
                  alternativeEmail: 'testEmail@email.com',
                  signUpType: 'userSignUp',
                })
                .expect(200)
                .end((listAddErr) => {
                    // Handle list save error
                  if (listAddErr) {
                    done(listAddErr);
                  }

                    // Get a list of lists
                  agent.get(`/users/${user.uuid}/lists`)
                        .auth(config.authUser, config.authPassword)
                        // .expect(200)
                        .end((listGetErr, listGetRes) => {
                            // Handle lists get error
                          if (listGetErr) {
                            done(listGetErr);
                          }

                            // Get lists list
                          const lists = listGetRes.body;

                            // Set assertions
                          const newRelationship = lists[2];
                          newRelationship.should.have.property('signUpType', 'userSignUp');
                            // Call the assertion callback
                          done();
                        });
                });
    });
  });

  it('should return a proper error if the wrong user uuid is provided when adding', (done) => {
        // Save a new user
    agent.post('/users')
            .auth(config.authUser, config.authPassword)
            .send(user)
            .expect(200)
            .end((userSaveErr, userSaveRes) => {
                // Handle list save error
              if (userSaveErr) {
                return done(userSaveErr);
              }

                // Provide the wrong user uuid
              agent.post('/users/' + 'wrongUuid' + '/lists')
                    .auth(config.authUser, config.authPassword)
                    .send({
                      list: list2._id,
                    })
                    .expect(404)
                    .end((listDeleteErr, listDeleteRes) => {
                        // Handle list error
                      if (listDeleteErr) {
                        return done(listDeleteErr);
                      }

                        // Set assertions
                      listDeleteRes.body.should.have.a.property('message', 'User not found');

                        // Call the assertion callback
                      done();
                    });
            });
  });

  it('should not throw an error if the user is already a member of the list provided', (done) => {
        // Create new user model instance
    user.save(() => {
      agent.post(`/users/${user.uuid}/lists`)
                .auth(config.authUser, config.authPassword)
                .send({
                  list: list1._id,
                })
                .expect(200)
                .end((listSaveErr) => {
                    // Handle list save error
                  if (listSaveErr) {
                    done(listSaveErr);
                  }

                    // Get a list of lists
                  agent.get(`/users/${user.uuid}/lists`)
                        .auth(config.authUser, config.authPassword)
                        .end((listGetErr, listGetRes) => {
                            // Handle lists get error
                          if (listGetErr) {
                            done(listGetErr);
                          }

                            // Get lists list
                          const lists = listGetRes.body;

                            // Set assertions
                          lists.should.have.a.lengthOf(2);
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
