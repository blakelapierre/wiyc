// config/config.local.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT
//
// DESCRIPTION:
// You put things here you don't want the world to know. Then, you never commit
// it or submit to anywhere public. That is how to keep things like your Google
// password safe while sharing everything you do with the world.
//
// If you do ever share this file at all anywhere, the smartest "Step 2" is to
// immediately change all your passwords.

'use strict';

var SocketIoLogLevels = {
  'ERROR': 0,
  'WARN': 1,
  'INFO': 2,
  'DEBUG': 3
};

module.exports = exports = {
  'emailUser': 'ENTER GMAIL ACCOUNT USERNAME',          // create one for Pulsar
  'emailPassword': 'ENGER GMAIL ACCOUNT PASSWORD',      // create one for Pulsar
  'userPasswordSalt': 'CREATE A UNIQUE PASSWORD SALT',  // suggested: Use a UUID
  'cookieSecret': 'CREATE A UNIQUE COOKIE SECRET',      // suggested: Use a UUID

  'frontEnd': 'http://robcolbert.com',
  'bind': {
    'address': '0.0.0.0',
    'port': 10010
  },

  'corsOptions': {
    'allowOrigins': [ 'http://127.0.0.1:9000' ],
    'allowMethods': [ 'GET', 'PUT', 'POST', 'DELETE' ],
    'allowHeaders': [ 'Content-Type', 'Authorization' ],
    'allowCredentials': true
  },

  'monitorOptions': {
    'enabled': true,
    'mountPoint': '/monitor',
    'maxHistoryLength': 3
  },

  'memcache': {
    'sessionCacheHosts': [ '127.0.0.1:11211' ],
    'dataCacheHosts'   : [ '127.0.0.1:11211' ]
  },

  'socketIo': {
    'enabled'    : true,
    'logLevel'   : SocketIoLogLevels.WARN,
    'allowOrigin': 'http://127.0.0.1:9000',
    'client': {
      'minify': true,
      'etag': true,
      'gzip': true
    }
  }

};

// AND DON'T EVER SHARE THIS FILE! IF YOU DO, CHANGE EVERYTHING AND MIGRATE
// THE USER PASSWORD SALT (TOTAL PAIN IN THE ASS). PLEASE: BE CAREFUL!!
