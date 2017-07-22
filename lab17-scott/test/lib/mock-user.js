'use strict';

const faker = require('faker');
const User = require('../../model/user.js');

const mockUser = module.exports = {};

mockUser.createOne = () => {
  let result = {};
  //set a pw property on result object to use on the hash method
  result.password = faker.internet.password();
  //use the constructor to create the new user
  return new User({
    username: faker.internet.userName(),
    email: faker.internet.email(),
  })
  .passwordHashCreate(result.password)
  .then(user => {
    result.user = user;
    return user.tokenCreate();
  })
  .then(token => {
    result.token = token;
    return result;
  });
};
