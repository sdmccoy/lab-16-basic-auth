'use strict';

const createError = require('http-errors');
const User = require('../model/user.js');

module.exports = (req, res, next) => {
  console.log('Hit basicAuth');
  //get the auhtorization property on the header portion of the request
  const {authorization} = req.headers;
  //return an error if no authorization property is found
  if (!authorization) return next(createError('authorization failed, no authorization provided'));

  //authorization comes in as 'Basic encodedstringinbase64' check if it's there
  let encoded = authorization.split('Basic ')[1];
  if (!encoded) return next(createError('authorization failed, no basic64 encoded authorization provided'));

  //decode the encoded auth and set it to the username and password
  let decoded = new Buffer(encoded, 'base64').toString();
  //using deconstructing process to assign the username and pw. comes in as user:pw
  let [username, password] = decoded.split(':');
  //if username and password doesn't exist, send an error
  if (!username || !password) return next(createError('authorization failed, username or password is missing'));

  //find the user in the database by matching the username
  User.findOne({username})
  .then(user => {
    //if no user is found, return error
    if (!user) return next(createError('authorization failed, no user was found'));
    //if user if found, compare the password with the passwordHash
    return user.passwordHashCompare(password);
  })
  .then(user => {
    req.user = user;
    next();
  })
  .catch(() => {
    return next(createError('authorization failed, password failed to match'));
  });
};
