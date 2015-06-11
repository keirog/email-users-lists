'use strict';

const lists = require('../controllers/lists.server.controller');
const users = require('../controllers/users.server.controller');
const listsByUser = require('../controllers/listsByUser.server.controller');



module.exports = (app) => {
    app.route('/users/:userUuid/lists')

        /**
         * @api {get} /users/:userUuid/lists/ Get Lists for a specific user.
         * @apiVersion 0.1.0
         * @apiName GetListsByUser
         * @apiGroup List
         *
         * @apiHeader {String} Authorization Basic Auth Token.
         *
         * @apiParam {String} userUuid User unique UUID.
         *
         * @apiSuccess {Object[]} lists The list of Lists.
         * @apiSuccess {ObjectId} list._id The List Object ID.
         * @apiSuccess {String} list.name  The name of the List.
         * @apiSuccess {String} list.description   The description for the List.
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
         */
        .get(listsByUser.list)


        /**
         * @api {post} /users/:userUuid/lists Add list to a specific user.
         * @apiVersion 0.1.0
         * @apiName AddListToUser
         * @apiGroup List
         *
         * @apiHeader {String} Authorization Basic Auth Token.
         *
         * @apiParam {String} userUuid User unique UUID.
         * @apiParam {ObjectId} listId List unique ID.
         *
         * @apiSuccess {Object[]} lists The list of Lists.
         * @apiSuccess {ObjectId} list._id The List Object ID.
         * @apiSuccess {String} list.name  The name of the List.
         * @apiSuccess {String} list.description   The description for the List.
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
         * @apiError ListIsInvalid The id of the List is not valid.
         * @apiError UuidIsInvalid The uuid provided is not valid.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 400 Bad Request
         *     {
         *       "message": "Invalid user uuid provided"
         *     }
         */
        .post(listsByUser.add);

    app.route('/users/:userUuid/lists/:listId')

        /**
         * @api {dekete} /users/:userUuid/lists/:listId Remove list from a specific user.
         * @apiVersion 0.1.0
         * @apiName RemoveListFromUser
         * @apiGroup List
         *
         * @apiHeader {String} Authorization Basic Auth Token.
         *
         * @apiParam {String} userUuid User unique UUID.
         * @apiParam {ObjectId} listId List unique ID.
         *
         * @apiSuccess {Object[]} lists The list of Lists.
         * @apiSuccess {ObjectId} list._id The List Object ID.
         * @apiSuccess {String} list.name  The name of the List.
         * @apiSuccess {String} list.description   The description for the List.
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
         * @apiError ListIsInvalid The id of the List is not valid.
         * @apiError UuidIsInvalid The uuid provided is not valid.

         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 400 Bad Request
         *     {
         *       "message": "Invalid user uuid provided"
         *     }
         */
        .delete(listsByUser.delete);

    app.param('userUuid', users.userByUuid);
    app.param('listId', lists.listById);
};