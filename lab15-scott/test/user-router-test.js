'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});
const expect = require('expect');
const superagent = require('superagent');
const server = require('../lib/server.js');
const clearDB = require('./lib/clear-db.js');
const mockUser = require('./lib/mock-user.js');
const API_URL = process.env.API_URL;

describe('Testing for user routes', () => {
  before(server.start);
  after(server.stop);
  afterEach(clearDB);

  describe('\nTesting POST route /api/signup', () => {
    describe('\nIf the post is successful', () => {
      it('It should return a token', () => {
        return superagent.post(`${API_URL}/api/signup`)
        .send({username: 'dingo', email: 'dogs@example.com', password: 'secret password'})
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.text).toExist();
          expect(res.text.length > 1).toBeTruthy();
        });
      });
    });
    describe('\nIf inputting bad pathname', () => {
      it('It should return a 404 status', () => {
        return superagent.post(`${API_URL}/api/badpath`)
        .send({username: 'dingo', email: 'dogs@example.com', password: 'secret password'})
        .catch(res => {
          expect(res.status).toEqual(404);
        });
      });
    });
    describe('\nIf inputting invalid body content', () => {
      it('It should return a 401 status', () => {
        return superagent.post(`${API_URL}/api/signup`)
        .send({username: 587, email: 'dogs@example.com', password: 'secret password'})
        .catch(res => {
          expect(res.status).toEqual(400);
        });
      });
    });
    describe('\nIf inputting NO body content', () => {
      it('It should return a 401 status', () => {
        return superagent.post(`${API_URL}/api/signup`)
        .send({})
        .catch(res => {
          expect(res.status).toEqual(401);
        });
      });
    });
  });

});
