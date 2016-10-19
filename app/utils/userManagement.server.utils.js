'use strict';

function manageExpiration (user) {
    if (user.email && (user.email.endsWith('@expired.com') ||
        user.email.endsWith('@ftexpiredaccounts.com') ||
        user.email.endsWith('@ftexpiredaccount.com') ||
        user.email.endsWith('@retired.com'))) {
        user.expiredUser = {
          value: true
        };
    } else {
        user.expiredUser = {
          value: false
        };
    }
}

function manageSuppression (oldUser, newUser) {
    if (newUser.email && newUser.email !== oldUser.email) {

        // Override the automaticallySuppressed/externallySuppressed tag if the user email changed
        oldUser.automaticallySuppressed = false;
        oldUser.externallySuppressed = false;
    }
}

exports.manageExpiration = manageExpiration;
exports.manageSuppression = manageSuppression;
