'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true, min: 1},
  email: {type: String, required: true, unique: true},
  passwordHash: {type: String, unique:true},
  tokenSeed: {type: String, unique: true, required: true},
});

module.exports = mongoose.model('user', userSchema);

//create methods on the schema to use for encryption logic

//this will take the password inputted on sign up, encode it, and save it as the new hash pw.
userSchema.methods.passwordHashCreate = function(password){
  console.log('password: ', password);
  //use hash method from bcrypt, pass in the passord, iterate over 8 times.
  return bcrypt.hash(password, 8)
  .then(hash => {
    console.log('hash: ', hash);
    this.passwordHash = hash;
    //returning this to be used in the next function
    console.log('this: ', this);
    return this;
  });
};

//this will compare the password inputted on GET or logins and match it with the encoded passwordHash
userSchema.methods.passwordHashCompare = function(password){
  console.log('password: ', password);
  console.log('this.pwhash: ', this.passwordHash);
  //use the compare method to pass in the pw and compare to the users pwhash value: returns boolean
  return bcrypt.compare(password, this.passwordHash)
  .then(isAMatch => {

    console.log('isAMatch: ', isAMatch);
    if (isAMatch) {
      //return the object if it's a match
      return  this;
    }
    //otherwise throw an Error
    throw new Error('authorization failed. Password did not match');
  });
};

//create a tokenSeed to identify the user is a real user.
userSchema.methods.tokenSeedCreate = function(){
  return new Promise((resolve, reject) => {
  //allow our app to attempt twice. if it's not unique then there's an issue with our crypto
    let attempts = 1;
    //function to create the tokenSeed
    let tokenSeedGenerate = () => {
      //use crypto to create a 32 bit string and turn to hex format. assign to this.tokenSeed
      //it will create then save, validate if unique, if not, run one more time.
      this.tokenSeed = crypto.randomBytes(32).toString('hex')
      .save()
      .then(() => resolve(this))
      .catch(() => {
        if (attempts < 1) return reject(new Error('Authorization failed. Server couldn\'t create token'));
        attempts--;
        tokenSeedGenerate();
      });
    };
    tokenSeedGenerate();
  });
};

//create a token for the user
