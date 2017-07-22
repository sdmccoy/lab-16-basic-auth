'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});
const expect = require('expect');
const superagent = require('superagent');

const server = require('../lib/server.js');
const mockUser = require('./lib/mock-user.js');
const clearDB = require('./lib/clear-db.js');

const API_URL = process.env.API_URL;

describe('\nTesting review routes', () => {
  before(server.start);
  after(server.stop);
  afterEach(clearDB);

  describe('\nTesting POST /api/reviews route', () => {
    describe('If post is successful', () => {
      it('It should respond status 200', () => {
        let tempUser;
        return mockUser.createOne()
        .then(userData => {
          tempUser = userData;
          return superagent.post(`${API_URL}/api/reviews`)
          .set('Authorization', `Bearer ${tempUser.token}`)
          .field('resortName', 'Big Bear')
          .field('rating', 3)
          .attach('image', `${__dirname}/assets/ski.jpg`)
          .then(res => {
            expect(res.status).toEqual(200);
            expect(res.body.resortName).toEqual('Big Bear');
            expect(res.body.rating).toEqual(3);
            expect(res.body.userID).toEqual(tempUser.user._id);
            expect(res.body.imageURI).toExist();
          });
        });
      });
    });
    describe('If sending no authorization header', () => {
      it('It should respond status 401', () => {
        return mockUser.createOne()
        .then(() => {
          return superagent.post(`${API_URL}/api/reviews`)
          .set('Authorization',``)
          .field('resortName', 'Big Bear')
          .field('rating', 3)
          .attach('image', `${__dirname}/assets/ski.jpg`)
          .catch(err => {
            expect(err.status).toEqual(401);
          });
        });
      });
    });
    describe('If sending a req with no token', () => {
      it('It should respond status 401', () => {
        return mockUser.createOne()
        .then(() => {
          return superagent.post(`${API_URL}/api/reviews`)
          .set('Authorization',`Bearer `)
          .field('resortName', 'Big Bear')
          .field('rating', 3)
          .attach('image', `${__dirname}/assets/ski.jpg`)
          .catch(err => {
            expect(err.status).toEqual(401);
          });
        });
      });
    });
    describe('If sending a req with a bad model content', () => {
      it('It should respond status 400', () => {
        let tempUser;
        return mockUser.createOne()
        .then(userData => {
          tempUser = userData;
          return superagent.post(`${API_URL}/api/reviews`)
          .set('Authorization',`Bearer ${tempUser.token}`)
          .field('resortName', 'Big Bear')
          .field('rating', 98)
          .attach('image', `${__dirname}/assets/ski.jpg`)
          .catch(err => {
            expect(err.status).toEqual(400);
          });
        });
      });
    });
  });
});
