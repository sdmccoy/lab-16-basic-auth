'use strict';

const dotenv = require('dotenv').config({path: `../.test.env`});
const expect = require('expect');
const superagent = require('superagent');
const server = require('../lib/server.js');
const clearDB = require('../lib/clear-db.js');
const mockUser = require('./lib/mock-user.js');
const API_URL = process.env.API_URL;

describe('Testing for user routes', () => {
  before(server.start);
  after(server.stop);
  afterEach(clearDB);

  describe('Testing POST route /api/signup', () => {
    describe('If the post is successful', () => {
      it('It should return a new user', () => {
        return superagent.post(`${API_URL}/api/signup`)
        .send({username: 'dingo', email: 'dogs@example.com', passwordHash: 'secret password'})
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.username).toEqual('dingo');
          expect(res.body.email).toEqual('dogs@example.com');
          expect(res.body.passwordHash).toExist();
          expect(res.body.tokenSeed).toExist();
        });
      });
    });
  });

});
