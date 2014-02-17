// config.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

var path = require('path');
var rootPath = path.normalize(__dirname + '/..');
var env = process.env.NODE_ENV || 'development';
var listenPort = 10010;

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

var monitorConfig = {
  enabled: true,
  mountPoint: '/monitor',
  maxHistoryLength: 3
};

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'api'
    },
    port: listenPort,
    db: 'mongodb://localhost/robcolbert-development',
    cors: corsConfig,
    monitor: monitorConfig
  },

  test: {
    root: rootPath,
    app: {
      name: 'api'
    },
    port: listenPort,
    db: 'mongodb://localhost/robcolbert-test',
    cors: corsConfig,
    monitor: monitorConfig
  },

  production: {
    root: rootPath,
    app: {
      name: 'api'
    },
    port: listenPort,
    db: 'mongodb://localhost/robcolbert-production',
    cors: corsConfig,
    monitor: monitorConfig
  }
};

module.exports = config[env];
