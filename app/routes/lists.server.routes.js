'use strict';

const lists = require('../controllers/lists.server.controller');

module.exports = (app) => {
    app.route('/lists')


        /**
         * @api {post} /lists/ Create a List.
         * @apiVersion 0.1.0
         * @apiName CreateLists
         * @apiGroup List
         *
         * @apiHeader {String} Authorization Basic Auth Token.
         *
         * @apiSuccess {String} name  The name of the List.
         * @apiSuccess {String} [description]   The description for the List.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "_id": "55719bbc18ef0a03008404cb",
         *       "name": "a eaque aut accusamus voluptatem pariatur",
         *       "description": "ipsam facere laboriosam rerum ut ab incidunt\ excepturi incidunt tempora ut in\ debitis placeat incidunt architecto distinctio non vitae vel maxime voluptatem\ at ad repellendus quos doloribus laudantium\ qui consequatur eos\ quam esse saepe"
         *     }
         *
         * @apiError ValidationError The posted List object is not valid.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 400 Bad Request
         *     {
         *       "message": "name cannot be blank"
         *     }
         */
        .post(lists.create)

        /**
         * @api {get} /lists/ Get all the Lists.
         * @apiVersion 0.1.0
         * @apiName GetLists
         * @apiGroup List
         *
         * @apiHeader {String} Authorization Basic Auth Token.
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
        .get(lists.list);

    app.route('/lists/:listId')


        /**
         * @api {get} /lists/:listId Get List information.
         * @apiVersion 0.1.0
         * @apiName GetList
         * @apiGroup List
         *
         * @apiHeader {String} Authorization Basic Auth Token.
         *
         * @apiParam {ObjectId} listId List unique ID.
         *
         * @apiSuccess {ObjectId} _id The List Object ID.
         * @apiSuccess {String} name  The name of the List.
         * @apiSuccess {String} description   The description for the List.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "_id": "55719bbc18ef0a03008404cb",
         *       "name": "a eaque aut accusamus voluptatem pariatur",
         *       "description": "ipsam facere laboriosam rerum ut ab incidunt\ excepturi incidunt tempora ut in\ debitis placeat incidunt architecto distinctio non vitae vel maxime voluptatem\ at ad repellendus quos doloribus laudantium\ qui consequatur eos\ quam esse saepe"
         *     }
         *
         * @apiError ListIsInvalid The id of the List is not valid.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 400 Bad Request
         *     {
         *       "message": "List is invalid"
         *     }
         */
        .get(lists.read)


        /**
         * @api {put} /lists/:listId Edit List information.
         * @apiVersion 0.1.0
         * @apiName EditList
         * @apiGroup List
         *
         * @apiHeader {String} Authorization Basic Auth Token.
         *
         * @apiParam {ObjectId} listId List unique ID.
         * @apiParam {String} [name]  The name of the List.
         * @apiParam {String} [description]   The description for the List.
         *
         * @apiSuccess {ObjectId} _id The List Object ID.
         * @apiSuccess {String} name  The name of the List.
         * @apiSuccess {String} description   The description for the List.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "_id": "55719bbc18ef0a03008404cb",
         *       "name": "a eaque aut accusamus voluptatem pariatur",
         *       "description": "ipsam facere laboriosam rerum ut ab incidunt\ excepturi incidunt tempora ut in\ debitis placeat incidunt architecto distinctio non vitae vel maxime voluptatem\ at ad repellendus quos doloribus laudantium\ qui consequatur eos\ quam esse saepe"
         *     }
         *
         * @apiError ListIsInvalid The id of the List is not valid.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 400 Bad Request
         *     {
         *       "message": "List is invalid"
         *     }
         */
        .put(lists.update)


        /**
         * @api {delete} /lists/:listId Delete List information.
         * @apiVersion 0.1.0
         * @apiName DeleteList
         * @apiGroup List
         *
         * @apiHeader {String} Authorization Basic Auth Token.
         *
         * @apiParam {ObjectId} listId List unique ID.
         *
         * @apiSuccess {ObjectId} _id The List Object ID.
         * @apiSuccess {String} name  The name of the List.
         * @apiSuccess {String} description   The description for the List.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "_id": "55719bbc18ef0a03008404cb",
         *       "name": "a eaque aut accusamus voluptatem pariatur",
         *       "description": "ipsam facere laboriosam rerum ut ab incidunt\ excepturi incidunt tempora ut in\ debitis placeat incidunt architecto distinctio non vitae vel maxime voluptatem\ at ad repellendus quos doloribus laudantium\ qui consequatur eos\ quam esse saepe"
         *     }
         *
         * @apiError ListIsInvalid The id of the List is not valid.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 400 Bad Request
         *     {
         *       "message": "List is invalid"
         *     }
         */
        .delete(lists.delete);

    app.param('listId', lists.listById);
};