const uuidv4 = require('uuid/v4');

function selectEventProperties(event) {
  return {
    uuid: event.uuid,
    suppressedMarketing: event.suppressedMarketing.value,
    suppressedNewsletter: event.suppressedNewsletter.value,
    suppressedAccount: event.suppressedAccount.value,
    suppressedRecommendation: event.suppressedRecommendation.value,
    expired: event.expiredUser.value,
    lists: event.lists.map(l => l.list)
  };
}

module.exports = (event) => {
  console.log(event);
  return {
    body: JSON.stringify(selectEventProperties(event)),
    contentType: 'application/json',
    messageId: uuidv4(),
    messageTimestamp: new Date(),
    messageType: event.messageType
  };
};
