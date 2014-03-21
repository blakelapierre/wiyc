// config.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

var path = require('path');
var crypto = require('crypto');

var rootPath = path.normalize(__dirname + '/..');
var env = process.env.NODE_ENV || 'development';
var listenPort = 10010;

var corsConfig = {
  'allowOrigins': [
    //'http://0.0.0.0:9000'
    'http://robcolbert.com'
  ],
  'allowMethods': [
    'GET',
    'PUT',
    'POST',
    'DELETE'
  ],
  'allowHeaders': [
    'Content-Type',
    'Authorization'
  ],
  'allowCredentials': true
};

var monitorConfig = {
  'enabled': true,
  'mountPoint': '/monitor',
  'maxHistoryLength': 3
};

function hashPassword (password) {
  var shasum = crypto.createHash('sha1');
  shasum.update(exports.app.passwordSalt + password);
  return shasum.digest('hex');
}

function generateRandomKey ( ) {
  var currentDate = (new Date()).valueOf().toString();
  var random = Math.random().toString();
  var shasum = crypto.createHash('sha1');
  shasum.update(exports.app.passwordSalt + currentDate + random);
  return shasum.digest('hex');
}

var config = {
  'development': {
    'root': rootPath,
    'app': {
      'name': 'pulsar-api',
      'passwordSalt': 'sVlf3r!c',
      'hashPassword': hashPassword,
      'generateRandomKey': generateRandomKey
    },
    'port': listenPort,
    'db': 'mongodb://localhost/robcolbert-development',
    'cors': corsConfig,
    'monitor': monitorConfig
  },

  'test': {
    'root': rootPath,
    'app': {
      'name': 'pulsar-api',
      'passwordSalt': 'sVlf3r!c',
      'hashPassword': hashPassword,
      'generateRandomKey': generateRandomKey
    },
    'port': listenPort,
    'db': 'mongodb://localhost/robcolbert-test',
    'cors': corsConfig,
    'monitor': monitorConfig
  },

  'production': {
    'root': rootPath,
    'app': {
      'name': 'pulsar-api',
      'passwordSalt': 'sVlf3r!c',
      'hashPassword': hashPassword,
      'generateRandomKey': generateRandomKey
    },
    'port': listenPort,
    'db': 'mongodb://localhost/robcolbert-production',
    'cors': corsConfig,
    'monitor': monitorConfig
  }
};

module.exports = exports = config[env];
