'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const User = require('../model/user.js');
const basicAuth = require('../lib/basic-auth-user-middleware.js');

const userRouter = module.exports = new Router();

userRouter.post('/api/signup', jsonParser, (req, res, next) => {
  console.log('Hit the POST /api/signup route');
  if (Object.keys(req.body).length < 1) {
    return next(createError('Please input a body'));
  }
  console.log('req.body.username: ', req.body.username);
  console.log('req.body.username type of: ', typeof req.body.username);
  console.log('req.body: ', req.body);
  User.create(req.body)
  .then(token => res.json(token))
  .catch(next);
});

userRouter.get('/api/signin', basicAuth, (req, res, next) => {
  console.log('Hit the GET /api/signin/:username/:password route');
  console.log('getroute req.username: ', req.body.username);
  console.log('getroute req.password: ', req.body.password);
  //the basicauth mw passes back the user as req.user if successful. Set a token for the login
  req.user.tokenCreate()
  .then(token => res.json(token))
  .catch(next);
});
