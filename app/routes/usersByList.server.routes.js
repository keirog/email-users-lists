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
         * @apiParam {Boolean} [valid] Filter: retrieve only valid/invalid user. Valid: only returns users not suppressed for supplied categories.
         * If no categegory supplied then all categories are sconsidered.
         * @apiParam {String} [categories="all categories"] A comma separated list of categories to consider for validity, if `valid` is supplied.
         *
         * @apiSuccess {Object[]} userList relationships array.
         * @apiSuccess {String} userList.uuid  The UUID of the User.
         * @apiSuccess {String} userList.email   The email the User for the specific List.
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
         * @apiSuccess {String} [userList.unsubscribeKey]   A key to be used to unsubscribe the user from this list.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     [{
         *       "email": "Freddy35@hotmail.com",
         *       "firstName": "Bob",
         *       "lastName": "Dylan",
         *       "unsubscribeKey": "SOMEKEY"
         *       "uuid": "34c6fc81-99d1-4ddd-a3b1-f778e2560a98"
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