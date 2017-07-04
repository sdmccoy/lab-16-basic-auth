'use strict';

const expect = require('expect');
const superagent = require('superagent');
const server = require('../lib/server.js');
const clearDB = require('../lib/clear-db.js');
const mockUser = require('./lib/mock-user.js');
const API_URL = process.env.API_URL;

describe('Testing for user routes', () => {
  before(server.start);
  after(server.stop);
  afterEach(cleardb());
});
