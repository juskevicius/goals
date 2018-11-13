const jwt = require('express-jwt');

const { cookie,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

const getTokenFromCookies = (req) => {
  const { cookies: { Token } } = req;
  if (Token) {
    return Token;
  } 
  return null;
};

const auth = {
  required: jwt({
    secret: 'secret',
    userProperty: 'payload',
    getToken: getTokenFromCookies,
  }),
  optional: jwt({
    secret: 'secret',
    userProperty: 'payload',
    getToken: getTokenFromCookies,
    credentialsRequired: false,
  }),
};

module.exports = auth;