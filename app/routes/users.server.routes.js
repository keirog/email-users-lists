'use strict';

const users = require('../controllers/users.server.controller');

module.exports = (app) => {
    app.route('/users')

        /**
         * @api {post} /users/ Create a User.
         * @apiVersion 0.2.0
         * @apiName CreateUser
         * @apiGroup User
         *
         * @apiHeader {String} Authorization Basic Auth Token.
         *
         * @apiHeaderExample {json} Header-Example:
         *     {
         *       "Authorization": "Accept-Encoding: Basic TGV2ZWxvcG1lbnQ6ZGV2ZWxvcG1lbnQ="
         *     }
         *
         * @apiParam {String} uuid  The UUID of the User.
         * @apiParam {String} email The email of the User.
         * @apiParam {[ObjectId[]]} list A list of Lists the User is member of.
         *
         * @apiSuccess {String} uuid  The UUID of the User.
         * @apiSuccess {String} email   The email for the User.
         * @apiSuccess {[ObjectId[]]} list A list of Lists the User is member of.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *      {
         *        "uuid": "d8df4982-c5fd-4102-8f61-e0dd0e608bcd",
         *        "email": "Moriah_Pagac@hotmail.com",
         *        "lists": [
         *           "55719bbc18ef0a03008404c4"
         *         ]
         *      }
         *
         * @apiError ValidationError The posted User object is not valid.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 400 Bad Request
         *     {
         *       "message": "uuid cannot be blank"
         *     }
         */
        .post(users.create)


        /**
         * @api {get} /users/ Get a list of Users.
         * @apiVersion 0.2.0
         * @apiName GetUsers
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
         */
        .get(users.list);

    app.route('/users/:userUuid')


        /**
         * @api {get} /users/:userUuid Get User information.
         * @apiVersion 0.2.0
         * @apiName GetUser
         * @apiGroup User
         *
         * @apiHeader {String} Authorization Basic Auth Token.
         *
         * @apiHeaderExample {json} Header-Example:
         *     {
         *       "Authorization": "Accept-Encoding: Basic TGV2ZWxvcG1lbnQ6ZGV2ZWxvcG1lbnQ="
         *     }
         *
         * @apiParam {ObjectId} userUuid User unique UUID.
         *
         * @apiSuccess {String} uuid  The UUID of the User.
         * @apiSuccess {String} email   The email for the User.
         * @apiSuccess {[ObjectId[]]} list A list of Lists the User is member of.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        "uuid": "d8df4982-c5fd-4102-8f61-e0dd0e608bcd",
         *        "email": "Moriah_Pagac@hotmail.com",
         *        "lists": [
         *           "55719bbc18ef0a03008404c4"
         *         ]
         *      }
         *
         * @apiError UserNotFound The UUID of the User is not found.
         * @apiError UuidIsInvalid The UUID of the User is not valid.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 400 Bad Request
         *     {
         *       "message": "uuid cannot be blank"
         *     }
         */
        .get(users.read)


        /**
         * @api {put} /users/:userUuid Edit User information.
         * @apiVersion 0.2.0
         * @apiName EditUser
         * @apiGroup User
         *
         * @apiHeader {String} Authorization Basic Auth Token.
         *
         * @apiHeaderExample {json} Header-Example:
         *     {
         *       "Authorization": "Accept-Encoding: Basic TGV2ZWxvcG1lbnQ6ZGV2ZWxvcG1lbnQ="
         *     }
         *
         * @apiParam {String} uuid  The UUID of the User.
         * @apiParam {String} [email] The email of the User.
         * @apiParam {[ObjectId[]]} list A list of Lists the User is member of.
         *
         * @apiSuccess {String} uuid  The UUID of the User.
         * @apiSuccess {String} email   The email for the User.
         * @apiSuccess {[ObjectId[]]} list A list of Lists the User is member of.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        "uuid": "d8df4982-c5fd-4102-8f61-e0dd0e608bcd",
         *        "email": "Moriah_Pagac@hotmail.com",
         *        "lists": [
         *           "55719bbc18ef0a03008404c4"
         *         ]
         *      }
         *
         * @apiError UserNotFound The UUID of the User is not found.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 404 Not Found
         *     {
         *       "message": "User not found"
         *     }
         */
        .put(users.update)


        /**
         * @api {delete} /users/:userUuid Delete User information.
         * @apiVersion 0.2.0
         * @apiName DeleteUser
         * @apiGroup User
         *
         * @apiHeader {String} Authorization Basic Auth Token.
         *
         * @apiHeaderExample {json} Header-Example:
         *     {
         *       "Authorization": "Accept-Encoding: Basic TGV2ZWxvcG1lbnQ6ZGV2ZWxvcG1lbnQ="
         *     }
         *
         * @apiParam {String} uuid  The UUID of the User.
         *
         * @apiSuccess {String} uuid  The UUID of the deleted User.
         * @apiSuccess {String} email   The email for the deleted User.
         * @apiSuccess {[ObjectId[]]} list A list of Lists the User was member of.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        "uuid": "d8df4982-c5fd-4102-8f61-e0dd0e608bcd",
         *        "email": "Moriah_Pagac@hotmail.com",
         *        "lists": [
         *           "55719bbc18ef0a03008404c4"
         *         ]
         *      }
         *
         * @apiError UserNotFound The UUID of the User is not found.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 404 Not Found
         *     {
         *       "message": "User not found"
         *     }
         */
        .delete(users.delete);

    app.param('userUuid', users.userByUuid);
};