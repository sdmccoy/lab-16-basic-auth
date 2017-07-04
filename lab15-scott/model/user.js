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


//create methods on the schema to use for encryption logic

//this will take the password inputted on sign up, encode it, and save it as the new hash pw.
userSchema.methods.passwordHashCreate = function(password){
  //use hash method from bcrypt, pass in the passord, iterate over 8 times.
  console.log('pwhashcreate pw: ', password);
  console.log('pwhashcreate this pw: ', this.password);
  return bcrypt.hash(password, 8)
  .then(hash => {
    console.log('pwhashcreate hash result: ', hash);
    this.passwordHash = hash;
    //returning this to be used in the next function
    return this;
  });
};

//this will compare the password inputted on GET or logins and match it with the encoded passwordHash
userSchema.methods.passwordHashCompare = function(password){
  console.log('password: ', password);
  console.log('thispasswordhash: ', this.passwordHash);
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

//create a tokenSeed to identify the user is a real user.
userSchema.methods.tokenSeedCreate = function(){
  return new Promise((resolve, reject) => {
  //allow our app to attempt twice. if it's not unique then there's an issue with our crypto
    let attempts = 1;
    //function to create the tokenSeed
    let tokenSeedGenerate = () => {
      //use crypto to create a 32 bit string and turn to hex format. assign to this.tokenSeed
      //it will create then save, validate if unique, if not, run one more time.
      this.tokenSeed = crypto.randomBytes(32).toString('hex');
      this.save()
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

//create a token from the tokenSeed function
userSchema.methods.tokenCreate = function(){
  return this.tokenSeedCreate()
  .then(() => {
    //use jsonwebtoken sign method to take in the token seed and our secret app pw
    return jwt.sign({tokenSeed: this.tokenSeed}, process.env.APP_SECRET);
  });
};

const User = module.exports = mongoose.model('user', userSchema);

User.create = function(data){
  console.log('create fn pw: ', data.password);
  //delete the password from the object but save it in a variable to use temporarily.
  let password = data.password;
  delete data.password;
  console.log('create fn pw after: ', password);
  console.log('create type of username: ', typeof data.username);
  //create a new user based on the req data passed in. Invoke the hash function with the temp saved pw
  // invoke the tokenCreate on the newUser object to give it a token.
  return new User(data)
  .passwordHashCreate(password)
  .then(newUser => newUser.tokenCreate());
};
