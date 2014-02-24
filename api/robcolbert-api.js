// robcolbert-api.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

var winston = require('winston');
winston.cli();

winston.add(winston.transports.File, { 'filename': 'robcolbert-api.log' });
winston.info('api.robcolbert.com startup initiated');

var express = require('express');
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

  var app = express();
  app.log = winston;

  require('./config/express')(app, config);
  require('./config/routes')(app);

  var monitor = new robcolbert.monitor.Monitor(app, config);

  winston.info('API server listening on port', config.port);
  app.listen(config.port);
});
