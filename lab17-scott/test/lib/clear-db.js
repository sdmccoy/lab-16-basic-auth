'use strict';

const User = require('../../model/user.js');
const Review = require('../../model/review.js');

module.exports = () => {
  return Promise.all([
    User.remove({}),
    Review.remove({}),
  ]);
};
