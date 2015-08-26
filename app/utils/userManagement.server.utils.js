'use strict';

function manageExpiration (user) {
    if (user.email.endsWith('@expired.com') || user.email.endsWith('@ftexpiredaccounts.com')) {
        user.expired = true;
    }
}

function manageSuppression (oldUser, newUser) {
    if (newUser.email && newUser.email !== oldUser.email) {

        // Override the automaticallySuppressed tag if the user email changed
        oldUser.automaticallySuppressed = false;
    }
}

exports.manageExpiration = manageExpiration;
exports.manageSuppression = manageSuppression;