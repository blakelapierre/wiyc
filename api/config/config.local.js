// config/config.local.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT
//
// DESCRIPTION:
// This file controls environment-local options for the Pulsar API server. By
// default, it is configured to access the Pulsar API server on localhost with
// several invalid credentials.
//
// It will contain sensitive information. Distribution should be carefully
// managed.

'use strict';

var SocketIoLogLevels = {
  'ERROR': 0,
  'WARN': 1,
  'INFO': 2,
  'DEBUG': 3
};

module.exports = exports = {

  /*
   * GMail username and password until I spend time making it more flexible.
   * Create a GMail account specifically for use by your Pulsar. If you try
   * to share your personal account, you are probably going to run into problems
   * and it's not a recommended approach.
   */
  'emailUser': process.env.PULSAR_GMAIL_USERNAME,
  'emailPassword': process.env.PULSAR_GMAIL_PASSWORD,

  /*
   * The password salt is used to ensure that your database contains passwords
   * salted uniquely to your environment. If you value your and your users'
   * privacy, you will uuidgen a password salt here and archive that UUID
   * somewhere very safe.
   */
  'userPasswordSalt': process.env.PULSAR_PASSWORD_SALT,

  /*
   * The cookie secret is used to hash and secure cookie values shared with the
   * client to help prevent man-in-the-middle attacks on service calls.
   */
  'cookieSecret': process.env.PULSAR_COOKIE_SECRET,

  /*
   * Where does your front end service live?
   */
  'frontEnd': 'http://robcolbert.com',

  /*
   * To what should I bind the Pulsar API?
   */
  'bind': {
    'address': '0.0.0.0',
    'port': 80
  },

  /*
   * From where do you accept requests at this Pulsar API?
   */
  'corsOptions': {
    'allowOrigins': [ 'http://robcolbert.com' ],
    'allowMethods': [ 'GET', 'PUT', 'POST', 'DELETE' ],
    'allowHeaders': [ 'Content-Type', 'Authorization' ],
    'allowCredentials': true
  },

  /*
   * Do you want to allow performance and availability monitoring of this Pulsar
   * API instance?
   */
  'monitorOptions': {
    'enabled': true,
    'mountPoint': '/monitor',
    'maxHistoryLength': 3
  },

  /*
   * Your list of memcached hosts. memcached is not an optional component at
   * this time.
   */
  'memcache': {
    'sessionCacheHosts': [ '127.0.0.1:11211' ],
    'dataCacheHosts'   : [ '127.0.0.1:11211' ]
  },

  /*
   * socket.io is used to implement real-time messaging in Pulsar. If you elect
   * to enable socket.io, it makes perfect sense to also enable and use the
   * PulseWire communications plugin.
   */
  'socketIo': {
    'enabled': true,
    'logLevel': SocketIoLogLevels.WARN,
    'allowOrigin': 'http://robcolbert.com',
    'client': {
      'minify': true,
      'etag': true,
      'gzip': true
    }
  }

};

// AND DON'T EVER SHARE THIS FILE! IF YOU DO, CHANGE EVERYTHING AND MIGRATE
// THE USER PASSWORD SALT (TOTAL PAIN IN THE ASS). PLEASE: BE CAREFUL!!
