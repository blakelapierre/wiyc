// plugins/pulsewire/pulsewire.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

var RouteAssembler = require('pulsar-api-framework').expressjs.RouteAssembler;
var PulseWireClient = require('./lib/pulsewire-client');

/*
 * FUNCTION
 *  guid
 *
 * PURPOSE
 *  Create a GUID-like string for use as session auth tokens. Hitting the easy
 *  button for now. Will find or much the "crypto powerups" later. I have three
 *  lives left.
 */
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
  };
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

/*
 * PLUGIN
 *  PulseWire
 *
 * PURPOSE
 *  Implement the Pulsar real-time communications protocol PulseWire using
 *  socket.io.
 */
function PulseWire (app, http, config) {

  this.app = app;
  this.http = http;
  this.config = config;

}

/*
 * INSTANCE METHOD
 *  start
 *
 * PURPOSE
 *  Pulsar API modules must implement an instance method named start. Pulsar
 *  will call the method when it wants to enable the plugin for online service.
 */
PulseWire.prototype.start = function (io) {
  var self = this;
  io.on('connection', function (socket) { self.onClientConnection(socket); });

  var routeAssembler = new RouteAssembler(this.app, this.config);
  routeAssembler.add({
    'uri'             : '/pulsewire/sessions',
    'method'          : 'POST',
    'controllerMethod': function (req, res) { return self.onSessionsCreate(req,res); }
  });
  routeAssembler.add({
    'uri'             : '/pulsewire/sessions',
    'method'          : 'GET',
    'controllerMethod': function (req, res) { return self.getUserSession(req, res); }
  });
};

/*
 * INSTANCE METHOD
 *  stop
 *
 * PURPOSE
 *  Pulsar API modules must implement an instance method named stop. Pulsar will
 *  call the method when it wants the plugin to stop doing whatever it does.
 *  This is commonly during system shutdown, or if the plugin exceeds a resource
 *  quota configured by the Pulsar administrator.
 *
 *  Shut down socket.io and release all allocated resources. Stop all manner of
 *  PulseWire processing.
 */
PulseWire.prototype.stop = function ( ) {
  this.io.close();
  delete this.io;
};

/*
 * REST METHOD
 *  onSessionsCreate
 *
 * PURPOSE
 *  Create a new user session for the authenticated user and grant them an
 *  access token. The client must then present the access token when connecting
 *  to PulseWire to gain message-passing access to the server.
 */
PulseWire.prototype.onSessionsCreate = function (req, res) {

  /*
   * 1. Create a UUID
   * 2. Store the UUID in memcached keyed to the user's _id
   * 3. Return the UUID to the client
   * 4. Client connects using socket.io
   * 5. Server sends 'hello' message
   * 6. Client responds with 'hello' of its own containing userId and session
   *    token UUID
   * 7. If the UUID value matches what was sent to that user by this handler,
   *    the user is granted access. Otherwise, the socket is closed.
   */

  req.session.pulsewire = {
    'channelUrl': 'http://'+this.config.bind.address+':'+this.config.bind.port+'/'+PulseWire.packageMeta.pulsar.socketio.channel,
    'authToken': guid()
  };
  res.json(200, req.session.pulsewire);
};

/*
 * SOCKET.IO EVENT: onClientConnection
 * PURPOSE:
 * Called when socket.io receives an ingress connection/socket. Wraps the
 * PulseWire prototocol around the socket presented with closures for
 * PulseWire protocol message handlers.
 *
 * @TODO refactor to PulseWireClient
 */
PulseWire.prototype.onClientConnection = function (socket) {
  console.log('NEW CLIENT CONNECTION');
  var client = new PulseWireClient(this, socket);
  this.clients.push(client);

  client.sendHelloMessage();
};


/*
 * MODULE EXPORTS
 * Pulsar plugins *must* load their own package.json file and expose it as a
 * static property on the module export. The export is expected to be a function
 * and Pulsar calls new on that function to create an instance of the plugin.
 */
PulseWire.packageMeta = require('../package.json');
delete PulseWire.packageMeta.main;

module.exports = exports = PulseWire;
