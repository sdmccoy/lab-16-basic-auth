'use strict';

const dotenv = require('dotenv').config();
const express = require('express');
const server = require('./lib/server.js');

server.start();
