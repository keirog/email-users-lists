'use strict';

const lists = require('../controllers/lists.server.controller');
const users = require('../controllers/users.server.controller');
const listsByUser = require('../controllers/listsByUser.server.controller');

/**
 * @apiDefine ListByUserResponse
 *
 * @apiSuccess {Object[]} listsRelationships The list of List Relationships.
 * @apiSuccess {Object} listsRelationships.list The List Object.
 * @apiSuccess {ObjectID} listsRelationships.list._id The List Object ID.
 * @apiSuccess {Object} listsRelationships.list.externalIds External IDs.
 * @apiSuccess {String} [listsRelationships.list.externalIds.eBay] eBay ID.
 * @apiSuccess {String} [listsRelationships.list.description]   The description for the List.
 * @apiSuccess {String} [listsRelationships.unsubscribeKey]   A key to be used to unsubscribe the user from this list.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    [{
 *       "list":{
 *          "_id":"55801ec760c5056e10dbcf0b",
 *          "externalIds": {},
 *          "name":"molestiae et nihil enim nostrum sequi nemo occaecati",
 *          "description":"ipsum ipsa nulla itaque\net quod esse aut fuga\nmaiores dignissimos voluptate laboriosam\nat autem reiciendis quas",
 *       },
 *       "unsubscribeKey": "SOMEKEY"
 *    }]
 *
 * @apiError UserNotFound The User UUID provided is not valid.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "User not found"
 *     }
 *
 */



module.exports = (app) => {
    app.route('/users/:userUuid/lists')

        /**
         * @api {get} /users/:userUuid/lists/ Get Lists for a specific user.
         * @apiVersion 0.3.0
         * @apiName GetListsByUser
         * @apiGroup List
         *
         * @apiUse BasicAuthHeader
         *
         * @apiParam {String} userUuid User unique UUID.
         *
         * @apiUse ListByUserResponse
         *
         */
        .get(listsByUser.list)


        /**
         * @api {post} /users/:userUuid/lists Add List to a specific User.
         * @apiVersion 0.3.0
         * @apiName AddListToUser
         * @apiGroup List
         *
         * @apiUse BasicAuthHeader
         *
         * @apiParam {String} userUuid User unique UUID.
         * @apiParam {ObjectId} list List unique ID.
         *
         * @apiUse ListByUserResponse
         */
        .post(listsByUser.add);

    app.route('/users/:userUuid/lists/:listId')

        /**
         * @api {delete} /users/:userUuid/lists/:listId Remove list from a specific user.
         * @apiVersion 0.3.0
         * @apiName RemoveListFromUser
         * @apiGroup List
         *
         * @apiUse BasicAuthHeader
         *
         * @apiParam {String} userUuid User unique UUID.
         * @apiParam {ObjectId} listId List unique ID.
         *
         * @apiUse ListByUserResponse
         *
         */
        .delete(listsByUser.delete);

    app.route('/users/:userUuid/lists')
        .delete(listsByUser.deleteAll);

    app.param('userUuid', users.userByUuid);
    app.param('listId', lists.listById);
};
