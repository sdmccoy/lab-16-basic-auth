'use strict';

const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));
app.use(require('../route/user-router.js'));
//404 catch all route
app.all('/api/*', (req, res, next) => res.sendStatus(404));
app.use(require('./error-middleware.js'));


const serverControl = module.exports = {};

serverControl.isOn = false;

serverControl.start = () => {
  return new Promise((resolve, reject) => {
    if (!serverControl.isOn) {
      serverControl.http = app.listen(process.env.PORT, () => {
        serverControl.isOn = true;
        console.log('Server up on', process.env.PORT);
        resolve();
      });
      return;
    }
    reject(new Error('The server is already running'));
  });
};

serverControl.stop = () => {
  return new Promise((resolve, reject) => {
    if (serverControl.isOn) {
      serverControl.http.close(() => {
        serverControl.isOn = false;
        console.log('Server shut down');
        resolve();
      });
      return;
    }
    reject(new Error('The server is already off'));
  });
};
