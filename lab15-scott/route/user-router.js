'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const User = require('../model/user.js');

const userRouter = module.exports = new Router();

userRouter.post('/api/signup', jsonParser, (req, res, next) => {
  console.log('Hit the POST /api/signup route');
  User.create(req.body)
  .then(token => res.json(token))
  .catch(next);
});
