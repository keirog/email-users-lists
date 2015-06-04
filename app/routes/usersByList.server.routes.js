'use strict';

const lists = require('../controllers/lists.server.controller');
const usersByList = require('../controllers/usersByList.server.controller');



module.exports = (app) => {
    app.route('/lists/:listId/users')
        .get(usersByList.list);

    app.param('listId', lists.listById);
};