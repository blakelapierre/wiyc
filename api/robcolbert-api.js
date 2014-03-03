// robcolbert-api.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

var winston = require('winston');
winston.add(winston.transports.File, { 'filename': 'robcolbert-api.log' });
winston.cli();

var app = require('express')();
app.log = winston;

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var mongoose = require('mongoose');
var fs = require('fs');
var config = require('./config/config');
var robcolbert = require('robcolbert-utils');

winston.info('connecting to database at ' + config.db);
mongoose.connect(config.db);

var db = mongoose.connection;
db.on('error', function (err) {
  if (err) {
    winston.error('db connect', err);
  }
  throw new Error('unable to connect to database');
});

db.on('open', function ( ) {
  winston.info('connected to database');
  var modelsPath = __dirname + '/app/models';
  fs.readdirSync(modelsPath).forEach(function (file) {
    if (file.indexOf('.js') >= 0) {
      require(modelsPath + '/' + file);
    }
  });

  require('./config/express')(app, config);
  require('./config/routes')(app, config);

  var monitor = new robcolbert.monitor.Monitor(app, config);

  io.sockets.on('connection', function (socket) {
    socket.emit('hello', {
      'service':'PulseWire Real-Time Messaging',
      'version':'0.0.1'
    });
    socket.on('goodbye', function (data) {
    });
  });

  winston.info('API server listening on port', config.port);
  server.listen(config.port, '0.0.0.0');
});
