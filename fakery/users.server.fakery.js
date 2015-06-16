'use strict';

/**
 * Generates fake data for the User model.
 * To populate the lists, the lists generator needs to run before
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// External modules
require('dotenv').load({silent: true});
const mongoose = require('mongoose');
const fakery = require('mongoose-fakery');
const faker = require('faker');
const async = require('async');

const db = require('../config/mongoose')();
const crypto = require('../app/utils/crypto.server.utils');
const User = mongoose.model('User');
const List = mongoose.model('List');

let usersToCreate = 5000000;
let count = 0;

User.remove(() => {
    async.whilst( () => { return (count < usersToCreate); }, (next) => {
        count++;
        createFakeUser(next);
    }, (err) => {
        if (err) { console.log(err); }
        else { console.log(usersToCreate + ' users added'); }
        process.exit();
    });
});

function createFakeUser (next) {

    // Find a random list to be member of
    List.count().exec(function(err, count){
        let random = Math.floor(Math.random() * count);
        List.findOne().skip(random).exec(

            function (err, list) {

                let listId = list._id.toString();

                // Generate fake user
                fakery.fake('user', User, {
                    uuid: faker.random.uuid(),
                    email: crypto.encrypt(faker.internet.email()),
                    lists: [{
                        list: listId,
                        alternativeEmail: crypto.encrypt(faker.internet.email()),
                        frequency: faker.random.array_element(['immediate', 'digest']),
                        products: [faker.random.array_element(['next', 'ft.com'])]
                    }]
                });

                // Save fake user
                fakery.makeAndSave('user', (err) =>  {
                    if (err) {
                        console.log(err);
                        next(err);
                    }
                    else {
                        next();
                    }

                });

            });

    });

}