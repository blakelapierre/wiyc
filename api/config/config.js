/*
 * FILE
 *  config.js
 *
 * PURPOSE
 *
 *
 * LICENSE
 *  Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to
 *  deal in the Software without restriction, including without limitation the
 *  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 *  sell copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 *  IN THE SOFTWARE.
 */

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
    'db': 'mongodb://localhost/pulsar-api-development',
    'cors': localConfig.corsOptions,
    'monitor': localConfig.monitorOptions
  },

  'test': {
    'root': rootPath,
    'app': {
      'name': 'pulsar-api-test',
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
    'db': 'mongodb://localhost/pulsar-api-test',
    'cors': localConfig.corsOptions,
    'monitor': localConfig.monitorOptions
  },

  'production': {
    'root': rootPath,
    'app': {
      'name': 'pulsar-api-prod',
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
    'db': 'mongodb://localhost/pulsar-api-production',
    'cors': localConfig.corsOptions,
    'monitor': localConfig.monitorOptions
  }
};

module.exports = exports = config[env];
