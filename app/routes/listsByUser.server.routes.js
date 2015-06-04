'use strict';

const lists = require('../controllers/lists.server.controller');
const users = require('../controllers/users.server.controller');
const listsByUser = require('../controllers/listsByUser.server.controller');



module.exports = (app) => {
    app.route('/users/:userUuid/lists')
        .get(listsByUser.list)
        .post(listsByUser.add);

    app.route('/users/:userUuid/lists/:listId')
        .delete(listsByUser.delete);

    app.param('userUuid', users.userByUuid);
    app.param('listId', lists.listById);
};