'use strict';

const users = require('../controllers/users.server.controller');

/**
 * @apiDefine UserResponse
 *
 * @apiSuccess {String} uuid  The UUID of the User.
 * @apiSuccess {String} email   The email for the User.
 * @apiSuccess {String} firstName  The first name of the User.
 * @apiSuccess {String} lastName  The last name of the User.
 * @apiSuccess {Object} user.suppressedNewsletter An object containing newsletter category suppressions.
 * @apiSuccess {Boolean} user.suppressedNewsletter.value A flag for Newsletter category suppressed users.
 * @apiSuccess {String} [user.suppressedNewsletter.reason] A reason for Newsletter category suppressed users.
 * @apiSuccess {Object} user.suppressedMarketing An object containing marketing category suppressions.
 * @apiSuccess {Boolean} user.suppressedMarketing.value A flag for Marketing category suppressed users.
 * @apiSuccess {String} [user.suppressedMarketing.reason] A reason for Marketing category suppressed users.
 * @apiSuccess {Object} user.suppressedRecommendation An object containing recommendation category suppressions.
 * @apiSuccess {Boolean} user.suppressedRecommendation.value A flag for Recommendation category suppressed users.
 * @apiSuccess {String} [user.suppressedRecommendation.reason] A reason for Recommendation category suppressed users.
 * @apiSuccess {Object} user.suppressedAccount An object containing account category suppressions.
 * @apiSuccess {Boolean} user.suppressedAccount.value A flag for Account category suppressed users.
 * @apiSuccess {String} [user.suppressedAccount.reason] A reason for Account category suppressed users.
 * @apiSuccess {Object} user.expiredUser An object containing expired user info.
 * @apiSuccess {Boolean} user.expiredUser.value A flag for Expired users.
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
         * @apiParam {Object} user Object containing the properties of the user to be updated
         * @apiParam {Object} [user.suppressedNewsletter] An object containing newsletter category suppressions.
         * @apiParam {Boolean} [user.suppressedNewsletter.value=flase] A flag for Newsletter category suppressed users.
         * @apiParam {String} [user.suppressedNewsletter.reason] A reason for Newsletter category suppressed users.
         * @apiParam {Object} [user.suppressedMarketing] An object containing marketing category suppressions.
         * @apiParam {Boolean} [user.suppressedMarketing.value=flase] A flag for Marketing category suppressed users.
         * @apiParam {String} [user.suppressedMarketing.reason] A reason for Marketing category suppressed users.
         * @apiParam {Object} [user.suppressedRecommendation] An object containing recommendation category suppressions.
         * @apiParam {Boolean} [user.suppressedRecommendation.value=flase] A flag for Recommendation category suppressed users.
         * @apiParam {String} [user.suppressedRecommendation.reason] A reason for Recommendation category suppressed users.
         * @apiParam {Object} [user.suppressedAccount] An object containing account category suppressions.
         * @apiParam {Boolean} [user.suppressedAccount.value=flase] A flag for Account category suppressed users.
         * @apiParam {String} [user.suppressedAccount.reason] A reason for Account category suppressed users.
         * @apiParam {Object} [user.expiredUser] An object containing expired user info.
         * @apiParam {Boolean} [user.expiredUser.value=false] A flag for Expired users.
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
         * @apiParam {Boolean} [valid] Filter: retrieve only valid/invalid user. Valid: only returns users not suppressed for supplied categories.
         * If no categegory supplied then all categories are sconsidered.
         * @apiParam {String} [categories="all categories"] A comma separated list of categories to consider for validity, if `valid` is supplied.
         *
         * @apiSuccess {Object[]} users The list of Users.
         * @apiSuccess {String} user.uuid  The UUID of the User.
         * @apiSuccess {String} user.firstName  The first name of the User.
         * @apiSuccess {String} user.lastName  The last name of the User.
         * @apiSuccess {String} user.email   The email for the User.
         * @apiSuccess {Object} user.suppressedNewsletter An object containing newsletter category suppressions.
         * @apiSuccess {Boolean} user.suppressedNewsletter.value A flag for Newsletter category suppressed users.
         * @apiSuccess {String} [user.suppressedNewsletter.reason] A reason for Newsletter category suppressed users.
         * @apiSuccess {Object} user.suppressedMarketing An object containing marketing category suppressions.
         * @apiSuccess {Boolean} user.suppressedMarketing.value A flag for Marketing category suppressed users.
         * @apiSuccess {String} [user.suppressedMarketing.reason] A reason for Marketing category suppressed users.
         * @apiSuccess {Object} user.suppressedRecommendation An object containing recommendation category suppressions.
         * @apiSuccess {Boolean} user.suppressedRecommendation.value A flag for Recommendation category suppressed users.
         * @apiSuccess {String} [user.suppressedRecommendation.reason] A reason for Recommendation category suppressed users.
         * @apiSuccess {Object} user.suppressedAccount An object containing account category suppressions.
         * @apiSuccess {Boolean} user.suppressedAccount.value A flag for Account category suppressed users.
         * @apiSuccess {String} [user.suppressedAccount.reason] A reason for Account category suppressed users.
         * @apiSuccess {Object} user.expiredUser An object containing expired user info.
         * @apiSuccess {Boolean} user.expiredUser.value A flag for Expired users.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *    [{
         *      "uuid": "deb15e25-b44c-4f4d-aa32-262214ff757c",
         *      "email": "Jeramy32@yahoo.com",
         *      "suppressedNewsletter": { value: false },
         *      "suppressedMarketing": { value: false },
         *      "suppressedRecommendation": { value: false },
         *      "suppressedAccount": { value: true, reason: "BOUNCE: invalid recipient" },
         *      "expiredUser": { value: false }
         *    },
         *    {
         *      "uuid": "3af4c3fd-2cbd-48bc-b87f-2664ef33c103",
         *      "email": "Oleta79@hotmail.com",
         *      "suppressedNewsletter": { value: false },
         *      "suppressedMarketing": { value: false },
         *      "suppressedRecommendation": { value: false },
         *      "suppressedAccount": { value: false },
         *      "expiredUser": { value: false }
         *    }]
         *
         */
        .get(users.list);

    app.route('/users/search')
       /**
         * @api {post} /users/search Search users matching a list of params.
         * @apiVersion 0.3.0
         * @apiName SearchUsers
         * @apiGroup User
         *
         * @apiUse BasicAuthHeader
         *
         * @apiParam {Number} [p=1]  The pagination page to retrieve.
         * @apiParam {Number} [pp=100] The number of Users per page to retrieve.
         * @apiParam {Boolean} [valid] Filter: retrieve only valid/invalid user. Valid: only returns users not suppressed for supplied categories.
         * If no categegory supplied then all categories are sconsidered.
         * @apiParam {String} [categories="all categories"] A comma separated list of categories to consider for validity, if `valid` is supplied.
         * @apiParam {String} [email] Filter: retrieve only users matching the provided email.
         *
         * @apiSuccess {Object[]} users The list of Users.
         * @apiSuccess {String} user.uuid  The UUID of the User.
         * @apiSuccess {String} user.firstName  The first name of the User.
         * @apiSuccess {String} user.lastName  The last name of the User.
         * @apiSuccess {String} user.email   The email for the User.
         * @apiSuccess {Object} user.suppressedNewsletter An object containing newsletter category suppressions.
         * @apiSuccess {Boolean} user.suppressedNewsletter.value A flag for Newsletter category suppressed users.
         * @apiSuccess {String} [user.suppressedNewsletter.reason] A reason for Newsletter category suppressed users.
         * @apiSuccess {Object} user.suppressedMarketing An object containing marketing category suppressions.
         * @apiSuccess {Boolean} user.suppressedMarketing.value A flag for Marketing category suppressed users.
         * @apiSuccess {String} [user.suppressedMarketing.reason] A reason for Marketing category suppressed users.
         * @apiSuccess {Object} user.suppressedRecommendation An object containing recommendation category suppressions.
         * @apiSuccess {Boolean} user.suppressedRecommendation.value A flag for Recommendation category suppressed users.
         * @apiSuccess {String} [user.suppressedRecommendation.reason] A reason for Recommendation category suppressed users.
         * @apiSuccess {Object} user.suppressedAccount An object containing account category suppressions.
         * @apiSuccess {Boolean} user.suppressedAccount.value A flag for Account category suppressed users.
         * @apiSuccess {String} [user.suppressedAccount.reason] A reason for Account category suppressed users.
         * @apiSuccess {Object} user.expiredUser An object containing expired user info.
         * @apiSuccess {Boolean} user.expiredUser.value A flag for Expired users.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *    [{
         *      "uuid": "deb15e25-b44c-4f4d-aa32-262214ff757c",
         *      "email": "Jeramy32@yahoo.com",
         *      "suppressedNewsletter": { value: false },
         *      "suppressedMarketing": { value: false },
         *      "suppressedRecommendation": { value: false },
         *      "suppressedAccount": { value: true, reason: "BOUNCE: invalid recipient" },
         *      "expiredUser": { value: false }
         *    }]
         *
         */
        .post(users.search);

    app.route('/users/update-one')
       /**
         * @api {post} /users/update-one Update user located by email or uuid.
         * @apiVersion 0.3.0
         * @apiName UpdateUser
         * @apiGroup User
         *
         * @apiUse BasicAuthHeader
         *
         * @apiParam {Object} key Object containing property used to locate the
         * user to update. One property is mandatory.
         * @apiParam {String} [key.uuid] The UUID of the user to edit
         * @apiParam {String} [key.email] The email of the user to edit
         * @apiParam {Object} user Object containing the properties of the user to be updated
         * @apiParam {Object} [user.suppressedNewsletter] An object containing newsletter category suppressions.
         * @apiParam {Boolean} [user.suppressedNewsletter.value=flase] A flag for Newsletter category suppressed users.
         * @apiParam {String} [user.suppressedNewsletter.reason] A reason for Newsletter category suppressed users.
         * @apiParam {Object} [user.suppressedMarketing] An object containing marketing category suppressions.
         * @apiParam {Boolean} [user.suppressedMarketing.value=flase] A flag for Marketing category suppressed users.
         * @apiParam {String} [user.suppressedMarketing.reason] A reason for Marketing category suppressed users.
         * @apiParam {Object} [user.suppressedRecommendation] An object containing recommendation category suppressions.
         * @apiParam {Boolean} [user.suppressedRecommendation.value=flase] A flag for Recommendation category suppressed users.
         * @apiParam {String} [user.suppressedRecommendation.reason] A reason for Recommendation category suppressed users.
         * @apiParam {Object} [user.suppressedAccount] An object containing account category suppressions.
         * @apiParam {Boolean} [user.suppressedAccount.value=flase] A flag for Account category suppressed users.
         * @apiParam {String} [user.suppressedAccount.reason] A reason for Account category suppressed users.
         * @apiParam {Object} [user.expiredUser] An object containing expired user info.
         * @apiParam {Boolean} [user.expiredUser.value=false] A flag for Expired users.
         *
         * @apiParamExample {json} Request-Example:
         *    {
         *      "key": {
         *        "email": "Jeramy32@yahoo.com"
         *      },
         *      "user": {
         *        "suppressedNewsletter": { value: false }
         *      }
         *    }
         *
         * @apiSuccess {String} uuid  The UUID of the User.
         * @apiSuccess {String} firstName  The first name of the User.
         * @apiSuccess {String} lastName  The last name of the User.
         * @apiSuccess {Object} user.suppressedNewsletter An object containing newsletter category suppressions.
         * @apiSuccess {Boolean} user.suppressedNewsletter.value A flag for Newsletter category suppressed users.
         * @apiSuccess {String} [user.suppressedNewsletter.reason] A reason for Newsletter category suppressed users.
         * @apiSuccess {Object} user.suppressedMarketing An object containing marketing category suppressions.
         * @apiSuccess {Boolean} user.suppressedMarketing.value A flag for Marketing category suppressed users.
         * @apiSuccess {String} [user.suppressedMarketing.reason] A reason for Marketing category suppressed users.
         * @apiSuccess {Object} user.suppressedRecommendation An object containing recommendation category suppressions.
         * @apiSuccess {Boolean} user.suppressedRecommendation.value A flag for Recommendation category suppressed users.
         * @apiSuccess {String} [user.suppressedRecommendation.reason] A reason for Recommendation category suppressed users.
         * @apiSuccess {Object} user.suppressedAccount An object containing account category suppressions.
         * @apiSuccess {Boolean} user.suppressedAccount.value A flag for Account category suppressed users.
         * @apiSuccess {String} [user.suppressedAccount.reason] A reason for Account category suppressed users.
         * @apiSuccess {Object} user.expiredUser An object containing expired user info.
         * @apiSuccess {Boolean} user.expiredUser.value A flag for Expired users.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *    {
         *      "uuid": "deb15e25-b44c-4f4d-aa32-262214ff757c",
         *      "email": "Jeramy32@yahoo.com",
         *      "suppressedNewsletter": { value: false },
         *      "suppressedMarketing": { value: false },
         *      "suppressedRecommendation": { value: false },
         *      "suppressedAccount": { value: true, reason: "BOUNCE: invalid recipient" },
         *      "expiredUser": { value: false }
         *    }
         *
         */
      .post(users.updateOne);

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
         * @apiSuccess {Object} user.suppressedNewsletter An object containing newsletter category suppressions.
         * @apiSuccess {Boolean} user.suppressedNewsletter.value A flag for Newsletter category suppressed users.
         * @apiSuccess {String} [user.suppressedNewsletter.reason] A reason for Newsletter category suppressed users.
         * @apiSuccess {Object} user.suppressedMarketing An object containing marketing category suppressions.
         * @apiSuccess {Boolean} user.suppressedMarketing.value A flag for Marketing category suppressed users.
         * @apiSuccess {String} [user.suppressedMarketing.reason] A reason for Marketing category suppressed users.
         * @apiSuccess {Object} user.suppressedRecommendation An object containing recommendation category suppressions.
         * @apiSuccess {Boolean} user.suppressedRecommendation.value A flag for Recommendation category suppressed users.
         * @apiSuccess {String} [user.suppressedRecommendation.reason] A reason for Recommendation category suppressed users.
         * @apiSuccess {Object} user.suppressedAccount An object containing account category suppressions.
         * @apiSuccess {Boolean} user.suppressedAccount.value A flag for Account category suppressed users.
         * @apiSuccess {String} [user.suppressedAccount.reason] A reason for Account category suppressed users.
         * @apiSuccess {Object} user.expiredUser An object containing expired user info.
         * @apiSuccess {Boolean} user.expiredUser.value A flag for Expired users.
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
         * @apiParam {Object} [user.suppressedNewsletter] An object containing newsletter category suppressions.
         * @apiParam {Boolean} [user.suppressedNewsletter.value=flase] A flag for Newsletter category suppressed users.
         * @apiParam {String} [user.suppressedNewsletter.reason] A reason for Newsletter category suppressed users.
         * @apiParam {Object} [user.suppressedMarketing] An object containing marketing category suppressions.
         * @apiParam {Boolean} [user.suppressedMarketing.value=flase] A flag for Marketing category suppressed users.
         * @apiParam {String} [user.suppressedMarketing.reason] A reason for Marketing category suppressed users.
         * @apiParam {Object} [user.suppressedRecommendation] An object containing recommendation category suppressions.
         * @apiParam {Boolean} [user.suppressedRecommendation.value=flase] A flag for Recommendation category suppressed users.
         * @apiParam {String} [user.suppressedRecommendation.reason] A reason for Recommendation category suppressed users.
         * @apiParam {Object} [user.suppressedAccount] An object containing account category suppressions.
         * @apiParam {Boolean} [user.suppressedAccount.value=flase] A flag for Account category suppressed users.
         * @apiParam {String} [user.suppressedAccount.reason] A reason for Account category suppressed users.
         * @apiParam {Object} [user.expiredUser] An object containing expired user info.
         * @apiParam {Boolean} [user.expiredUser.value=false] A flag for Expired users.
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
        .patch(users.patch);

    app.param('userUuid', users.userByUuid);
};
