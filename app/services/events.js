/* jshint ignore:start */
const fetch = require('node-fetch');
const config = require('../../config/config');
const logger = require('../../config/logger');

function options(body) {
  return {
    method: 'POST',
    headers: {
      'X-API-KEY': config.eventsServiceAuth,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  }
}

function isJsonResponse(res) {
  return res.headers.get('content-type') === 'application/json';
}

async function parseJsonResponse(res) {
  let resBody;
  try {
    resBody = await res.json();
  } catch (err) {
    logger.warn('Sent Event JSON response was invalid');
    resBody = { message: '' };
  }
  return resBody;
}

async function sendEvent(event) {
  const res = await fetch(`${config.eventsServiceHost}/webhooks/user-preferences`, options(event));
  let resBody;
  if (isJsonResponse(res)) {
    resBody = await parseJsonResponse(res);
  } else {
    resBody = { message: await res.text() };
  }
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return resBody;
}

module.exports = {
  sendEvent
};
/* jshint ignore:end */
