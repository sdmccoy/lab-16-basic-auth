'use strict';

// const errorHandler = module.exports = {};

module.exports = (err, req, res, next) => {
  console.log('Hit error handler');
  console.error(err.message);
  //401 error is no body
  if(err.message.toLowerCase().includes('please input a body')) return res.sendStatus(401);
  //400 error if bad content
  if(err.message.toLowerCase().includes('validation failed')) return res.sendStatus(400);
  //404 error if bad id
  if(err.message.toLowerCase().includes('objectid failed')) return res.sendStatus(404);
  //409 error if duplicate content
  if(err.message.toLowerCase().includes('duplicate key')) return res.sendStatus(409);

  res.sendStatus(500);
};
