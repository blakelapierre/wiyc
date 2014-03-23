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
    winston.error('authentication check failed', req.session, message);
    res.json(500, { 'message': message });
    return false;
  }
  return true;
};

app.checkAdmin = function (req, res, message) {
  if (!this.checkAuthentication(req, res, message)) {
    return false;
  }
  if (!req.session.user.isAdmin) {
    winston.error('admin rights failed', req.session, message);
    res.json(500, { 'message': message });
    return false;
  }
  return true;
};

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var monitor = null;

var mongoose = require('mongoose');
var fs = require('fs');
var config = require('./config/config');
var pulsar = require('pulsar-api-framework');

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

  monitor = new pulsar.monitor.Monitor(app, config);
  io.sockets.on('connection', function (socket) {
    socket.emit('hello', {
      'service':'PulseWire Real-Time Messaging',
      'version':'0.0.1'
    });
    socket.on('goodbye', function (data) {
      winston.info('socket.goodbye', data);
    });
  });

  winston.info('API server listening on port', config.port);
  server.listen(config.port, '0.0.0.0');
});
