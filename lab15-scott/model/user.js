'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true, min: 1},
  email: {type: String, required: true, unique: true},
  passwordHash: {type: String, unique:true},
  seedToken: {type: String, unique: true, required: true},
});

module.exports = mongoose.model('user', userSchema);

//create methods on the schema to use for encryption logic

//this will take the password inputted on sign up, encode it, and save it as the new hash pw.
userSchema.methods.passwordHashCreate = function(password){
  //use hash method from bcrypt, pass in the passord, iterate over 8 times.
  return bcrypt.hash(password, 8)
  .then(hash => {
    this.passwordHash = hash;
    //returning this to be used in the next function
    return this;
  });
};

//this will compare the password inputted on GET or logins and match it with the encoded passwordHash
userSchema.methods.passwordHashCompare = function(password){
  //use the compare method to pass in the pw and compare to the users pwhash value: returns boolean
  return bcrypt.compare(password, this.passwordHash)
  .then(isAMatch => {
    if (isAMatch) {
      //return the object if it's a match
      return  this;
    }
    //otherwise throw an Error
    throw new Error('authorization failed. Password did not match');
  });
};
