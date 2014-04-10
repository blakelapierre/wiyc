// pulsar-api.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

var app = require('express')();
app.log = require('winston');
app.log.add(app.log.transports.File, { 'filename': 'pulsar-api.log' });
app.log.cli();

/*
 * Pulsar API events are managed as an events property on the app because
 * ExpressJS certainly has its own events, and I don't want to trample on
 * them or need to worry about them. Thus, Pulsar offers its own events
 * "namespace" by simply offering app.events.on('somePulsarEvent', ...).
 */
var events = require('events');
app.events = new events.EventEmitter();
var eventStats = {
  'listenerCounts': { }
};
app.events.on('newListener', function (eventName) {
  if (eventStats.listenerCounts[eventName]) {
    eventStats.listenerCounts[eventName] += 1;
  } else {
    eventStats.listenerCounts[eventName] = 1;
  }
  app.log.info('events.addListener', {
    'name': eventName,
    'stats': eventStats
  });
});

app.events.on('removeListener', function (eventName) {
  if (eventStats.listenerCounts[eventName]) {
    if (--eventStats.listenerCounts[eventName] === 0) {
      delete eventStats.listenerCounts[eventName];
    }
  }
  app.log.info('events.removeListener', {
    'name': eventName,
    'stats': eventStats
  });
});

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
