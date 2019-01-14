const jwt = require('express-jwt');

const getTokenFromCookies = (req) => {
  const { cookies: { Token } } = req;
  if (Token) {
    return Token;
  } 
  return null;
};

const auth = {
  required: jwt({
    secret: process.env.SECRET2,
    userProperty: 'payload',
    getToken: getTokenFromCookies,
  }),
  optional: jwt({
    secret: process.env.SECRET2,
    userProperty: 'payload',
    getToken: getTokenFromCookies,
    credentialsRequired: false,
  }),
};

module.exports = auth;