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
     * @apiSuccess {String} [description]   The description for the List.
     * @apiSuccess {Boolean} [inactive=false]   The list is not active.
     * @apiSuccess {Object} externalIds External IDs.
     * @apiSuccess {String} [externalIds.eBay] eBay ID.
     * @apiSuccess {String} [imageURL]   The URL for the list image.
     * @apiSuccess {String} [frequency]   The send frequency for the list.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "_id": "55719bbc18ef0a03008404cb",
     *       "externalIds": {},
     *       "name": "a eaque aut accusamus voluptatem pariatur",
     *       "description": "ipsam facere laboriosam rerum ut ab incidunt\ excepturi incidunt tempora ut in\ debitis placeat incidunt architecto distinctio non vitae vel maxime voluptatem\ at ad repellendus quos doloribus laudantium\ qui consequatur eos\ quam esse saepe",
     *       "inactive": false,
     *       "imageURL": "http://www.example.com/image001.jpg",
     *       "frequency": "Weekly"
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
     * @apiSuccess {Object} list.externalIds External IDs.
     * @apiSuccess {String} [list.externalIds.eBay] eBay ID.
     * @apiSuccess {String} list.description   The description for the List.
     * @apiSuccess {Boolean} [list.inactive=false]   The list is not active.
     * @apiSuccess {String} [imageURL]   The URL for the list image.
     * @apiSuccess {String} [frequency]   The send frequency for the list.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     [{
     *       "_id": "55719bbc18ef0a03008404cb",
     *       "externalIds": {},
     *       "name": "a eaque aut accusamus voluptatem pariatur",
     *       "description": "ipsam facere laboriosam rerum ut ab incidunt\ excepturi incidunt tempora ut in\ debitis placeat incidunt architecto distinctio non vitae vel maxime voluptatem\ at ad repellendus quos doloribus laudantium\ qui consequatur eos\ quam esse saepe",
     *       "inactive": true,
     *       "imageURL": "http://www.example.com/image001.jpg",
     *       "frequency": "Weekly"
     *     },
     *     {
     *       "_id": "55719bbc18ef0a030084048a",
     *       "externalIds": {
     *          "eBay": "234134234234"
     *       },
     *       "name": "commodi officiis natus",
     *       "description": "doloribus sunt qui qui voluptatem cumque voluptatem\nasperiores labore voluptatem saepe ratione\nea provident velit maiores non omnis quos temporibus\neum occaecati nostrum deserunt\neaque dicta cupiditate labore hic fugiat",
     *       "inactive": false,
     *       "imageURL": "http://www.example.com/image001.jpg",
     *       "frequency": "Weekly"
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
         * @apiParam {Object} externalIds External IDs.
         * @apiParam {String} [externalIds.eBay] eBay ID.
         * @apiParam {String} [description]   The description for the List.
         * @apiParam {Boolean} [inactive=false]   The list is not active.
         * @apiParam {String} [imageURL]   The URL for the list image.
         * @apiParam {String} [frequency]   The send frequency for the list.
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
         * @apiParam {Boolean} [inactive=false]   The list is not active.
         * @apiParam {String} [imageURL]   The URL for the list image.
         * @apiParam {String} [frequency]   The send frequency for the list.
         *
         * @apiUse ListResponse
         *
         */
        .patch(lists.update);

    app.param('listId', lists.listById);
};
