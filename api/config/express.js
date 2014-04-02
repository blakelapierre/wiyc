/*
 * FILE
 *  config/express.js
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

var express = require('express');
var pulsar = require('pulsar-api-framework');
var MemcachedStore = require('connect-memcached')(express);

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
      'store': new MemcachedStore({
        'hosts': config.app.memcache.sessionCacheHosts
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
