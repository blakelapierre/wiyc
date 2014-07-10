// config/express.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

var express = require('express');
var pulsar = require('pulsar-api-framework');

// var MemcachedStore = require('connect-memcached')(express);
var MongoStore = require('connect-mongodb');

module.exports = function(app, config) {
  app.configure(function () {
    app.use(express.compress());
    app.use(new pulsar.expressjs.CORS(app, config));
    app.use(express.static(config.root + '/public'));

    app.set('port', config.port);
    app.set('views', config.root + '/app/views');
    app.set('view engine', 'jade');

    app.use(express.favicon(config.root + '/public/img/favicon.ico'));
    app.use(express.logger('dev'));
    app.use(express.cookieParser('itsFullOfStars'));
    app.use(express.session({
      'secret': config.app.cookieSecret,
      // 'store': new MemcachedStore({
      //   'hosts': config.app.memcache.sessionCacheHosts
      // })
      'store': new MongoStore({
        'db': app.db.db,
        'reapInterval': 30000 // reap every thirty seconds
      })
    }));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);

    app.use(function(req, res) {
      res.json(404, {
        'status': 404,
        'humor': 'The number you have dialed is no longer in service. Please hang up, check the number you are trying to reach and try your call again. [click]'
      });
    });

  });
};
