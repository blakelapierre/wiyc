// config/config.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

var path = require('path');
var crypto = require('crypto');
var localConfig = require('./config.local');
//console.log('LOCAL CONFIG', localConfig);

var rootPath = path.normalize(__dirname + '/..');
var env = process.env.NODE_ENV || 'development';

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
      'name': 'pulsar-api-dev',
      'frontendUrl': localConfig.frontendUrl,
      'cookieSecret': localConfig.cookieSecret,
      'passwordSalt': localConfig.userPasswordSalt,
      'hashPassword': hashPassword,
      'generateRandomKey': generateRandomKey,
      'emailUser': localConfig.emailUser,
      'emailPassword': localConfig.emailPassword,
      'memcache': localConfig.memcache,
      'socketio': localConfig.socketIo
    },
    'bind': localConfig.bind,
    'db': process.env.PULSAR_API_DB,
    'cors': localConfig.corsOptions,
    'monitor': localConfig.monitorOptions
  },

  'test': {
    'root': rootPath,
    'app': {
      'name': 'pulsar-api-test',
      'frontendUrl': localConfig.frontendUrl,
      'passwordSalt': localConfig.userPasswordSalt,
      'hashPassword': hashPassword,
      'generateRandomKey': generateRandomKey,
      'emailUser': localConfig.emailUser,
      'emailPassword': localConfig.emailPassword,
      'memcache': {
        'sessionCacheHosts': localConfig.sessionCacheHosts,
        'dataCacheHosts': localConfig.dataCacheHosts
      },
      'socketio': localConfig.socketIo
    },
    'bind': localConfig.bind,
    'db': process.env.PULSAR_API_DB,
    'cors': localConfig.corsOptions,
    'monitor': localConfig.monitorOptions
  },

  'production': {
    'root': rootPath,
    'app': {
      'name': 'pulsar-api-prod',
      'frontendUrl': localConfig.frontendUrl,
      'passwordSalt': localConfig.userPasswordSalt,
      'hashPassword': hashPassword,
      'generateRandomKey': generateRandomKey,
      'emailUser': localConfig.emailUser,
      'emailPassword': localConfig.emailPassword,
      'memcache': {
        'sessionCacheHosts': localConfig.sessionCacheHosts,
        'dataCacheHosts': localConfig.dataCacheHosts
      },
      'socketio': localConfig.socketIo
    },
    'bind': localConfig.bind,
    'db': process.env.PULSAR_API_DB,
    'cors': localConfig.corsOptions,
    'monitor': localConfig.monitorOptions
  }
};

module.exports = exports = config[env];
