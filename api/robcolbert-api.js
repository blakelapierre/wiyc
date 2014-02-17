// robcolbert-api.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
var config = require('./config/config');
var robcolbert = require('robcolbert-utils');
console.log('robcolbert', robcolbert.monitor);

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

db.on('open', function ( ) {
  console.log('connected to database', config.db);
  var modelsPath = __dirname + '/app/models';
  fs.readdirSync(modelsPath).forEach(function (file) {
    if (file.indexOf('.js') >= 0) {
      require(modelsPath + '/' + file);
    }
  });

  var app = express();
  require('./config/express')(app, config);
  require('./config/routes')(app);

  var monitor = new robcolbert.monitor.Monitor(app, config);

  console.log('API server listening on port', config.port);
  app.listen(config.port);
});

setInterval(function ( ) { console.log('ssh buster'); }, 15000);
