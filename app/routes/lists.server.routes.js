'use strict';

const lists = require('../controllers/lists.server.controller');

module.exports = (app) => {

    /**
     * @apiDefine BasicAuthHeader
     *
     * @apiHeader {String} Authorization Basic Auth Token.
     *
     * @apiHeaderExample {json} Header-Example:
     *     {
     *       "Authorization": "Accept-Encoding: Basic TGV2ZWxvcG1lbnQ6ZGV2ZWxvcG1lbnQ="
     *     }
     */

    /**
     * @apiDefine ListResponse
     *
     * @apiSuccess {String} name  The name of the List.
     * @apiSuccess {String} identifier A unique identifier for the list.
     * @apiSuccess {String} [description]   The description for the List.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "_id": "55719bbc18ef0a03008404cb",
     *       "identifier": "deb15e25-b44c-4f4d-aa32-262214ff757c"
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
     **/

    /**
     * @apiDefine ListsResponse
     *
     * @apiSuccess {Object[]} lists The list of Lists.
     * @apiSuccess {ObjectId} list._id The List Object ID.
     * @apiSuccess {String} list.name  The name of the List.
     * @apiSuccess {String} list.identifier  The unique identifier dor the List.
     * @apiSuccess {String} list.description   The description for the List.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     [{
     *       "_id": "55719bbc18ef0a03008404cb",
     *       "identifier":"80b99e3b-375b-4464-adc7-754b466e5204",
     *       "name": "a eaque aut accusamus voluptatem pariatur",
     *       "description": "ipsam facere laboriosam rerum ut ab incidunt\ excepturi incidunt tempora ut in\ debitis placeat incidunt architecto distinctio non vitae vel maxime voluptatem\ at ad repellendus quos doloribus laudantium\ qui consequatur eos\ quam esse saepe"
     *     },
     *     {
     *       "_id": "55719bbc18ef0a030084048a",
     *       "identifier":"80b99e3b-375b-4464-adc7-754b466e5205",
     *       "name": "commodi officiis natus",
     *       "description": "doloribus sunt qui qui voluptatem cumque voluptatem\nasperiores labore voluptatem saepe ratione\nea provident velit maiores non omnis quos temporibus\neum occaecati nostrum deserunt\neaque dicta cupiditate labore hic fugiat"
     *     }]
     *
     **/


    app.route('/lists')


        /**
         * @api {post} /lists/ Create a List.
         * @apiVersion 0.3.0
         * @apiName CreateList
         * @apiGroup List
         *
         * @apiUse BasicAuthHeader
         *
         * @apiParam {String} name  The name of the List.
         * @apiParam {String} identifier A unique identifier for the list.
         * @apiParam {String} [description]   The description for the List.
         *
         * @apiUse ListResponse
         */
        .post(lists.create)

        /**
         * @api {get} /lists/ Get all the Lists.
         * @apiVersion 0.3.0
         * @apiName GetLists
         * @apiGroup List
         *
         * @apiUse BasicAuthHeader
         *
         * @apiUse ListsResponse
         *
         */
        .get(lists.list);

    app.route('/lists/:listId')


        /**
         * @api {get} /lists/:listId Get List.
         * @apiVersion 0.3.0
         * @apiName GetList
         * @apiGroup List
         *
         * @apiUse BasicAuthHeader
         *
         * @apiParam {ObjectId} listId List unique ID.
         *
         * @apiUse ListResponse
         *
         */
        .get(lists.read)


        /**
         * @api {patch} /lists/:listId Edit List.
         * @apiVersion 0.3.0
         * @apiName EditList
         * @apiGroup List
         *
         * @apiUse BasicAuthHeader
         *
         * @apiParam {ObjectId} listId List unique ID.
         * @apiParam {String} [name]  The name of the List.
         * @apiParam {String} [description]   The description for the List.
         *
         * @apiUse ListResponse
         *
         */
        .patch(lists.update)


        /**
         * @api {delete} /lists/:listId Delete List.
         * @apiVersion 0.3.0
         * @apiName DeleteList
         * @apiGroup List
         *
         * @apiUse BasicAuthHeader
         *
         * @apiParam {ObjectId} listId List unique ID.
         *
         * @apiUse ListResponse
         */
        .delete(lists.delete);

    app.param('listId', lists.listById);
};