'use strict';

const createError = require('http-errors');
const User = require('../model/user.js');

module.exports = (req, res, next) => {
  //get the auhtorization property on the header portion of the request
  const {authorization} = req.headers;
  console.log('authorization: ', authorization);
  //return an error if no authorization property is found
  if (!authorization) return next(createError('No authorization provided'));

  //authorization comes in as 'Basic encodedstringinbase64' check if it's there
  let encoded = authorization.split('Basic ')[1];
  if (!encoded) return next(createError('No basic64 encoded authorization provided'));

  //decode the encoded auth and set it to the username and password
  let decoded = new Buffer(encoded, 'base64').toString();
  //using deconstructing process to assign the username and pw. comes in as user:pw
  let [username, password] = decoded.split(':');
  //if username and password doesn't exist, send an error
  if (!username || !password) return next(createError('username or password is missing'));

  console.log('encoded: ', encoded);
  console.log('decoded: ', decoded);
  console.log('username: ', username);
  console.log('password: ', password);

  //find the user in the database by matching the username
  User.findOne({username})
  .then(user => {
    //if no user is found, return error
    if (!user) return next(createError('No user was found'));
    //if user if found, compare the password with the passwordHash
    return User.passwordHashCompare(password);
  })
  .then(user => {
    req.user = user;
    next();
  })
  .catch(() => {
    return next(createError('password failed to match'));
  });
};
