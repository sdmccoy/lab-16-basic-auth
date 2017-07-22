'use strict';

const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
  resortName: {type: String, minlength: 1},
  rating: {type: Number, max: 10},
  imageURI: {type: String, required: true, minlength: 1},
  userID: {type: mongoose.Schema.Types.ObjectId, required: true},
});

module.exports = mongoose.model('review', reviewSchema);
