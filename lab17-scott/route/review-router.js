'use strict';

const {Router} = require('express');

const Review = require('../model/review.js');
//use to run the req through for authentication
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const s3Upload = require('../lib/s3-upload-middleware.js');

const reviewRouter = module.exports = new Router();

reviewRouter.post('/api/reviews', bearerAuth, s3Upload('image'), (req, res, next) => {
  console.log('Hit POST /api/reviews route');
  //start creating a new review now that we've created a user, saved to req object
  //ran through the bearerauth and verified it's they have access
  //ran the req through jwt & multer to attach file prop to req for the image.
  //loaded image to aws bucket. attached the s3data to the req.
  new Review({
    resortName: req.body.resortName,
    rating: req.body.rating,
    imageURI: req.s3Data.Location,
    userID: req.user._id.toString(),
  })
  .save()
  .then(newReview => {
    console.log('newReview: ', newReview);
    res.json(newReview);
  })
  .catch(next);
});
