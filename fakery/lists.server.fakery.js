'use strict';

/**
 * Generates fake data for the List model
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// External modules
require('dotenv').load({silent: true});
const mongoose = require('mongoose');
const fakery = require('mongoose-fakery');
const faker = require('faker');
const async = require('async');

const db = require('../config/mongoose')();
const List = mongoose.model('List');

let listsToCreate = 200;
let count = 0;

List.remove(() => {
    async.whilst( () => { return (count < listsToCreate); }, (next) => {
        count++;
        createFakeList(next);
    }, (err) => {
        if (err) { console.log(err); }
        else { console.log(listsToCreate + ' lists added'); }
        process.exit();
    });
});

function createFakeList (next) {

    fakery.fake('list', List, {
        name: faker.lorem.sentence(),
        description: faker.lorem.paragraph()
    });

    fakery.makeAndSave('list', (err) =>  {
        if (err) {
            console.log(err);
            next(err);
        }
        else {
            next();
        }
    });
}