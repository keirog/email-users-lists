'use strict';

const expiredDomains = ['@expired.com', '@ftexpiredaccounts.com', '@ftexpiredaccount.com', '@retired.com'];
function manageExpiration(user) {
    user.expiredUser = {
        value: expiredDomains.some(d => user.email.endsWith(d))
    };
}

function manageSuppression (oldUser, newUser) {
    if (newUser.email && newUser.email !== oldUser.email) {
        oldUser.suppressedNewsletter = { value: false };
        oldUser.suppressedMarketing = { value: false };
        oldUser.suppressedRecommendation = { value: false };
        oldUser.suppressedAccount = { value: false };
    }
}

module.exports = {
    manageExpiration,
    manageSuppression
};
