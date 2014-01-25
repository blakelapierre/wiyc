// config.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

var path = require('path');
var rootPath = path.normalize(__dirname + '/..');
var env = process.env.NODE_ENV || 'development';

var corsConfig = {
  'allowOrigins': [
    '*'
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

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'api'
    },
    port: 3000,
    db: 'mongodb://localhost/robcolbert-development',
    cors: corsConfig
  },

  test: {
    root: rootPath,
    app: {
      name: 'api'
    },
    port: 3000,
    db: 'mongodb://localhost/robcolbert-test',
    cors: corsConfig
  },

  production: {
    root: rootPath,
    app: {
      name: 'api'
    },
    port: 3000,
    db: 'mongodb://localhost/robcolbert-production',
    cors: corsConfig
  }
};

module.exports = config[env];
