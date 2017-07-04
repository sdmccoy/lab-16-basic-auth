'use strict';

const {Router} = require('express');
const User = require('../model/user.js');
const jsonParser = require('bodyParser');

const userRouter = module.exports = Router();

userRouter.post('/api/signup', jsonParser, (req, res, next) => {
  console.log('Hit the POST /api/signup route');

  return new User(req.body)
  .save()
  .then(token => res.json(token))
  .catch(next);
});
