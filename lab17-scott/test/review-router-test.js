'use strict';

require('dotenv').config({path: `${__dirname}\..\.test.env}`});
const expect = require('expect');
const superagent = require('superagent');

const server = require('../lib/server.js');
const mockUser = require('./lib/mock-user.js');
const clearDB = require('./lib/clear-db.js');

const API_URL = process.env.API_URL;

describe('Testing review routes', () => {
  before(server.start);
  after(server.stop);
  afterEach(clearDB);

  describe('Testing POST /api/reviews route', () => {
    describe('If post is successful', () => {
      it('It should respond 200 ', () => {
        let tempUser;
        return mockUser.createOne()
        .then(userData => {
          tempUser = userData;
          return superagent.post(`${API_URL}/api/reviews`)
          .set('Authorization', `Bearer ${tempUser.token}`)
          .field('resortName', 'Big Bear')
          .field('rating', 3)
          .attach('imageURI', `${__dirname}/assets/ski.jpg`)
          .then(res => {
            console.log('res body: ', res.body);
            expect(res.status).toEqual(200);
            expect(res.body.resortName).toEqual('Big Bear');
            expect(res.body.rating).toEqual(3);
            expect(res.body.userID).toEqual(tempUser._id);
            expect(res.body.imageURI).toExist();
          });
        });

      });
    });
  });
});
