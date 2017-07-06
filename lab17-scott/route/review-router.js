'use strict';

const {Router} = require('express');

const Review = require('../model/review.js');
//use to run the req through for authentication
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const reviewRouter = module.exports = new Router();

reviewRouter.post('/api/reviews', bearerAuth, (req, res, next) => {
  console.log('Hit POST /api/reviews route');

});