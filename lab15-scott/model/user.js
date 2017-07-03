'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true, min: 1},
  email: {type: String, required: true, unique: true},
  passwordHash: {type: String, unique:true},
  seedToken: {type: String},
});

module.exports = mongoose.model('user', userSchema);
