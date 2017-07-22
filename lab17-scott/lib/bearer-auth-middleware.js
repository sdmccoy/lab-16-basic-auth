'use strict';

//require jwt to give the user an access token for their session
const jwt = require('jsonwebtoken');
//require in http errors to create new errors
const createError = require('http-errors');
//universalify to solve the promise handler on the jwt.
const universalify = require('universalify');
//require in user model to authorize the user with bearer
const User = require('../model/user.js');


module.exports = (req, res, next) => {
  console.log('Hit bearerAuth');
  //use the authorization property on the req header to run error logic
  let {authorization} = req.headers;
  //if value on authorization property is empty send error
  if (!authorization) return next(createError('authorization failed, no auth header'));
  //check for the bearer token from the auth header value
  let token = authorization.split('Bearer ')[1];
  if (!token) return next(createError('authorization failed, no bearer token'));
  //use jwt verify method to decrypt the token & our app secret to see if it matches
  //need help explaining this one.
  universalify.fromCallback(jwt.verify)(token, process.env.APP_SECRET)
  .then(decoded => {
    //find the user based on the tokenSeed key and it's match its value
    return User.findOne({tokenSeed: decoded.tokenSeed});
  })
  .then(user => {
    //if no user found then return error
    if (!user) return next(createError('authorization failed, no user found'));
    //if user is found add the user to the request object
    req.user = user;
    //invoke next, why?
    next();
  })
  //if all fails then send server error message.
  .catch(next);
};
