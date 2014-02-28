// config/express.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

var express = require('express');
var rjcUtils = require('robcolbert-utils');
var MemcachedStore = require('connect-memcached')(express);

module.exports = function(app, config) {
  app.configure(function () {
    app.use(express.compress());
    app.use(new rjcUtils.expressjs.CORS(app, config));
    app.use(express.static(config.root + '/public'));

    app.set('port', config.port);
    app.set('views', config.root + '/app/views');
    app.set('view engine', 'jade');

    app.use(express.favicon(config.root + '/public/img/favicon.ico'));
    app.use(express.logger('dev'));
    app.use(express.cookieParser('itsFullOfStars'));
    app.use(express.session({
      'secret':'7890f124-ca66-46f5-8299-9ca14defd93f',
      'store': new MemcachedStore({
        'hosts': [ '127.0.0.1:11211' ]
      })
    }));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);

    app.use(function(req, res) {
      res.json(404, {'msg':'it\'s hard to imagine what you\'ve done wrong.'});
    });

  });
};
