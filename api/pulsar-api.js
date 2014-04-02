/*
 * FILE
 *  pulsar-api.js
 *
 * PURPOSE
 *  Initializes the Pulsar API server as configured and implemented.
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

var winston = require('winston');
winston.add(winston.transports.File, { 'filename': 'pulsar-api.log' });
winston.cli();

var app = require('express')();
app.log = winston;

app.checkAuthentication = function (req, res, message) {
  if (!req.session.user || !req.session.authenticated.status) {
    app.log.error(message);
    res.json(500, {
      'error': 'Authentication Failed',
      'message': message
    });
    return false;
  }
  return true;
};

app.checkAdmin = function (req, res, message) {
  if (!this.checkAuthentication(req, res, message)) {
    return false;
  }
  if (!req.session.user.isAdmin) {
    app.log.error('admin rights failed', req.session, message);
    res.json(500, { 'message': message });
    return false;
  }
  return true;
};

app.checkError = function (err, res, label) {
  if (err) {
    app.log.error(label, err);
    res.json(500, err);
    return true;
  }
  return false;
};

var server = require('http').createServer(app);
var monitor = null;

var mongoose = require('mongoose');
var fs = require('fs');
var config = require('./config/config');

var PulsarApiFramework = require('pulsar-api-framework');

app.log.info('connecting to database at ' + config.db);
mongoose.connect(config.db);

var db = mongoose.connection;
db.on('error', function (err) {
  if (err) {
    app.log.error('db connect', err);
  }
  throw new Error('unable to connect to database');
});

db.on('open', function ( ) {
  app.log.info('connected to database');

  // Data Models
  var modelsPath = __dirname + '/app/models';
  fs.readdirSync(modelsPath).forEach(function (file) {
    if (file.indexOf('.js') >= 0) {
      require(modelsPath + '/' + file);
    }
  });

  // ExpressJS REST API
  require('./config/express')(app, config);
  require('./config/routes')(app, config);

  // Pulsar Monitor Service
  monitor = new PulsarApiFramework.monitor.Monitor(app, config);

  app.log.info('API server listening on '+config.bind.address+':'+config.bind.port);
  server.listen(config.bind.port, config.bind.address);

  // socket.io instance and startup
  var socketIoConfig = config.app.socketio;
  app.log.info('socket.io config', socketIoConfig);
  var io = null;
  if (socketIoConfig.enabled) {
    io = require('socket.io').listen(server, {
      logger: {
        debug: app.log.debug,
        info: app.log.info,
        error: app.log.error,
        warn: app.log.warn
      }
    });
    io.set('origins', socketIoConfig.allowOrigin);
    io.set('transports', [
      'websocket',
      'flashsocket',
      'htmlfile',
      'xhr-polling',
      'jsonp-polling'
    ]);
    if (socketIoConfig.client.minify) {
      io.enable('browser client minification');
    }
    if (socketIoConfig.client.etag) {
      io.enable('browser client etag');
    }
    if (socketIoConfig.client.gzip) {
      io.enable('browser client gzip');
    }
    if (socketIoConfig.logLevel) {
      io.set('log level', socketIoConfig.logLevel);
    }
  }

  // Pulsar API plugins
  app.plugins = require(__dirname + '/app/plugins');
  app.channels = [ ];

  app.log.info('loading plugins');
  app.plugins.forEach(function (Plugin) {
    app.log.info('++', Plugin.packageMeta.name, 'socket.io', Plugin.packageMeta.pulsar.socketio);
    Plugin.instance = new Plugin(app, server, config);

    var channel = null, channelUuid;
    if (socketIoConfig.enabled) {
      channelUuid = Plugin.packageMeta.pulsar.socketio.channelUuid;
      channel = io.of('/'+channelUuid);
      app.channels.push({
        'channelUuid': channelUuid,
        'Plugin': Plugin,
        'socketioChannel': channel
      });
    }
    Plugin.instance.start(channel);
    // Plugin.instance.stop(); // here for testing to make sure plugins *can* stop
  });

  app.log.info('Pulsar online with', app.plugins.length, 'plugins and', app.channels.length, 'socket.io channels');

});
