'use strict';

const lists = require('../controllers/lists.server.controller');
const usersByList = require('../controllers/usersByList.server.controller');



module.exports = (app) => {
    app.route('/lists/:listId/users')


        /**
         * @api {get} /lists/:listId/users Get Users members of a List.
         * @apiVersion 0.2.0
         * @apiName GetUsersByList
         * @apiGroup User
         *
         * @apiHeader {String} Authorization Basic Auth Token.
         *
         * @apiHeaderExample {json} Header-Example:
         *     {
         *       "Authorization": "Accept-Encoding: Basic TGV2ZWxvcG1lbnQ6ZGV2ZWxvcG1lbnQ="
         *     }
         *
         * @apiParam {Number} [p=1]  The pagination page to retrieve.
         * @apiParam {Number} [pp=100] The number of Users per page to retrieve.
         *
         * @apiSuccess {Object[]} users The list of Users.
         * @apiSuccess {String} user.uuid  The UUID of the User.
         * @apiSuccess {String} user.email   The email for the User.
         * @apiSuccess {[ObjectId[]]} user.list A list of Lists the User is member of.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     [{
         *       "_id": "55719bbc18ef0a03008404cb",
         *       "name": "a eaque aut accusamus voluptatem pariatur",
         *       "description": "ipsam facere laboriosam rerum ut ab incidunt\ excepturi incidunt tempora ut in\ debitis placeat incidunt architecto distinctio non vitae vel maxime voluptatem\ at ad repellendus quos doloribus laudantium\ qui consequatur eos\ quam esse saepe"
         *     },
         *     {
         *       "_id": "55719bbc18ef0a030084048a",
         *       "name": "commodi officiis natus",
         *       "description": "doloribus sunt qui qui voluptatem cumque voluptatem\nasperiores labore voluptatem saepe ratione\nea provident velit maiores non omnis quos temporibus\neum occaecati nostrum deserunt\neaque dicta cupiditate labore hic fugiat"
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