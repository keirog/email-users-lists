'use strict';

const lists = require('../controllers/lists.server.controller');
const usersByList = require('../controllers/usersByList.server.controller');



module.exports = (app) => {
    app.route('/lists/:listId/users')


        /**
         * @api {get} /lists/:listId/users Get Users members of a List.
         * @apiVersion 0.3.0
         * @apiName GetUsersByList
         * @apiGroup User
         *
         * @apiUse BasicAuthHeader
         *
         * @apiParam {Number} [p=1]  The pagination page to retrieve.
         * @apiParam {Number} [pp=100] The number of Users per page to retrieve.
         *
         * @apiSuccess {Object[]} userList relationships array.
         * @apiSuccess {String} userList.uuid  The UUID of the User.
         * @apiSuccess {String} userList.email   The email the User for the specific List.
         * @apiSuccess {String} [userList.frequency]   Indication on when the email has to be sent.
         * @apiSuccess {String} [userList.products]   An array of products for the specific user-list relationship.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     [{
         *       "email": "Freddy35@hotmail.com"
         *       "frequency": "immediate"
         *       "products": ["next"]
         *       "uuid": "34c6fc81-99d1-4ddd-a3b1-f778e2560a98"          *
         *     }]
         *
         * @apiError UserNotFound The UUID of the User is not found.
         * @apiError ListIsInvalid The id of the List is not valid.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 404 Not Found
         *     {
         *       "message": "User not found"
         *     }         *
         */
        .get(usersByList.list);

    app.param('listId', lists.listById);
};