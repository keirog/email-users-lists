'use strict';

const users = require('../controllers/users.server.controller');

/**
 * @apiDefine UserResponse
 *
 * @apiSuccess {String} uuid  The UUID of the User.
 * @apiSuccess {String} email   The email for the User.
 * @apiSuccess {String} firstName  The first name of the User.
 * @apiSuccess {String} lastName  The last name of the User.
 * @apiSuccess {Boolean} expired A flag for expired users.
 * @apiSuccess {Boolean} manuallySuppressed A flag for manually suppressed users.
 * @apiSuccess {Boolean} automaticallySuppressed A flag for automatically suppressed users.
 * @apiSuccess {Boolean} externallySuppressed A flag for externally suppressed users.
 *
 * @apiSuccess {[ObjectId[]]} list A list of Lists Relationships for the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    {
 *      "uuid": "deb15e25-b44c-4f4d-aa32-262214ff757c",
 *      "email": "Jeramy32@yahoo.com",
 *      "firstName": "Bob",
 *      "lastName": "Dylan",
 *      "lists": [{
 *          "list": "55801ec760c5056e10dbcf0b",
 *          "frequency": "immediate",
 *          "unsubscribeKey": "SOMEKEY"
 *          "products": [
 *            "ft.com"
 *          ]
 *      }]
 *    }
 *
 *
 */

module.exports = (app) => {
    app.route('/users')

        /**
         * @api {post} /users Create a User.
         * @apiVersion 0.3.0
         * @apiName CreateUser
         * @apiGroup User
         *
         * @apiUse BasicAuthHeader
         *
         * @apiParam {String} uuid  The UUID of the User.
         * @apiParam {String} email The email of the User.
         * @apiParam {String} firstName The first name of the User.
         * @apiParam {String} lastName The last name of the User.
         * @apiParam {Boolean} [expired=false] A flag for expired users.
         * @apiParam {Boolean} [manuallySuppressed=false] A flag for manually suppressed users.
         * @apiParam {Boolean} [automaticallySuppressed=false] A flag for automatically suppressed users.
         * @apiParam {Boolean} [externallySuppressed=false] A flag for externallySuppressed suppressed users.
         * @apiParam {[ObjectId[]]} [list] A list of Lists the User is member of.
         *
         * @apiUse UserResponse
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
         * @api {get} /users Get a list of Users.
         * @apiVersion 0.3.0
         * @apiName GetUsers
         * @apiGroup User
         *
         * @apiUse BasicAuthHeader
         *
         * @apiParam {Number} [p=1]  The pagination page to retrieve.
         * @apiParam {Number} [pp=100] The number of Users per page to retrieve.
         * @apiParam {Boolean} [valid] Filter: retrieve only valid/invalid user. Valid: expired=false, automaticallySuppressed=false, manuallySuppressed=false, externallySuppressed=false
         *
         * @apiSuccess {Object[]} users The list of Users.
         * @apiSuccess {String} user.uuid  The UUID of the User.
         * @apiSuccess {String} user.firstName  The first name of the User.
         * @apiSuccess {String} user.lastName  The last name of the User.
         * @apiSuccess {String} user.email   The email for the User.
         * @apiSuccess {Boolean} user.expired A flag for expired users.
         * @apiSuccess {Boolean} user.manuallySuppressed A flag for manually suppressed users.
         * @apiSuccess {Boolean} user.automaticallySuppressed A flag for automatically suppressed users.
         * @apiSuccess {Boolean} user.externallySuppressed A flag for externally suppressed users.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *    [{
         *      "uuid": "deb15e25-b44c-4f4d-aa32-262214ff757c",
         *      "email": "Jeramy32@yahoo.com",
         *      "automaticallySuppressed":false,
         *      "manuallySuppressed":false,
         *      "expired":false,
         *      externallySuppressed: false
         *    },
         *    {
         *      "uuid": "3af4c3fd-2cbd-48bc-b87f-2664ef33c103",
         *      "email": "Oleta79@hotmail.com",
         *      "automaticallySuppressed":false,
         *      "manuallySuppressed":false,
         *      "expired":false,
         *      externallySuppressed: false
         *    }]
         *
         */
        .get(users.list);

    app.route('/users/:userUuid')


        /**
         * @api {get} /users/:userUuid Get User information.
         * @apiVersion 0.3.0
         * @apiName GetUser
         * @apiGroup User
         *
         * @apiUse BasicAuthHeader
         *
         * @apiParam {ObjectId} userUuid User unique UUID.
         *
         * @apiSuccess {String} uuid  The UUID of the User.
         * @apiSuccess {String} email   The email for the User.
         * @apiSuccess {[ObjectId[]]} list A list of Lists Relationships for the User.
         * @apiSuccess {Boolean} expired A flag for expired users.
         * @apiSuccess {Boolean} manuallySuppressed A flag for manually suppressed users.
         * @apiSuccess {Boolean} automaticallySuppressed A flag for automatically suppressed users.
         * @apiSuccess {Boolean} externallySuppressed A flag for automatically externally users.
         *
         * @apiUse UserResponse
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
         * @api {patch} /users/:userUuid Edit User information.
         * @apiVersion 0.3.0
         * @apiName EditUser
         * @apiGroup User
         *
         * @apiUse BasicAuthHeader
         *
         * @apiParam {String} uuid  The UUID of the User.
         * @apiParam {String} [email] The email of the User.
         * @apiParam {String} [firstName] The first name of the User.
         * @apiParam {String} [lastName] The last name of the User.
         * @apiParam {Boolean} [expired=false] A flag for expired users.
         * @apiParam {Boolean} [manuallySuppressed=false] A flag for manually suppressed users.
         * @apiParam {Boolean} [automaticallySuppressed=false] A flag for automatically suppressed users.
         * @apiParam {Boolean} [externallySuppressed=false] A flag for externallySuppressed suppressed users.         *
         *
         *  @apiUse UserResponse
         *
         * @apiError UserNotFound The UUID of the User is not found.
         * @apiError Forbidden Lists cannot be edited via this method.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 403 Forbidden
         *     {
         *       "message": "Forbidden. Lists cannot be edited via this method"
         *     }
         */
        .patch(users.update);

    app.param('userUuid', users.userByUuid);
};