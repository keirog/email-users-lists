'use strict';

const lists = require('../controllers/lists.server.controller');

module.exports = (app) => {
    app.route('/lists')
        .post(lists.create)
        .get(lists.list);

    app.route('/lists/:listId')
        .get(lists.read)
        .put(lists.update)
        .delete(lists.delete);

    app.param('listId', lists.listById);
};