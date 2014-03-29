// plugins/pulsewire/pulsewire.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

var PulsarApiFramework  = require('pulsar-api-framework');
var RouteAssembler      = PulsarApiFramework.expressjs.RouteAssembler;
var GUID                = PulsarApiFramework.tools.GUID;

var PulseWireLoadBalancer = require('./lib/pulsewire-load-balancer');
var PulseWireClient       = require('./lib/pulsewire-client');

/*
 * PLUGIN
 *  PulseWire
 *
 * PURPOSE
 *  Implement the Pulsar real-time communications protocol PulseWire using
 *  socket.io.
 */
function PulseWire (app, http, config) {

  this.packageMeta = PulseWire.packageMeta;
  this.app = app;
  this.log = app.log;
  this.http = http;
  this.config = config;

  this.loadBalancer = new PulseWireLoadBalancer(this);
  this.loadBalancer.addHost({
    'address':'127.0.0.1',
    'port':10010,
    'capacity':200
  });

  this.clients = [ ];

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

  if (!io) {
    return;
  }
  self.io = io;
  self.io.on('connection', function (socket) { self.onClientConnection(socket); });

  var routeAssembler = new RouteAssembler(self.app, self.config);
  routeAssembler.add({
    'uri'             : '/pulsewire/sessions',
    'method'          : 'POST',
    'controllerMethod': function (req, res) { return self.createUserSession(req,res); }
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
};

/*
 * REST METHOD
 *  createUserSession
 *
 * PURPOSE
 *  Create a new user session for the authenticated user and grant them an
 *  access token. The client must then present the access token when connecting
 *  to PulseWire to gain message-passing access to the server.
 */
PulseWire.prototype.createUserSession = function (req, res) {
  var channelUuid = PulseWire.packageMeta.pulsar.socketio.channelUuid; // alias
  var channelUrl = this.getChannelUrl(req, res, channelUuid);

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

  var sessionGuid = GUID();
  req.session.pulsewire = {
    'channelUrl': channelUrl,
    'authToken': sessionGuid
  };
  res.json(200, req.session.pulsewire);
};

PulseWire.prototype.getChannelUrl = function (req, res, channel) {
  var host = this.loadBalancer.selectHostForChannel(req, res, channel);
  if (!host) {
    return false;
  }
  var channelUrl = 'http://' + host.address + ':' + host.port + '/' + channel;
  return channelUrl;
};

/*
 * SOCKET.IO EVENT: onClientConnection
 * PURPOSE:
 * Called when socket.io receives an ingress connection/socket. Wraps the
 * PulseWire prototocol around the socket presented with closures for
 * PulseWire protocol message handlers.
 */
PulseWire.prototype.onClientConnection = function (socket) {
  this.log.info('ingress socket.io connection');
  var client = new PulseWireClient(this, socket);
  this.clients[socket.id] = client;
};


/*
 * MODULE EXPORTS
 * Pulsar plugins *must* load their own package.json and pulsar-plugin.json
 * files and expose them as a static property on the module export. The
 * export is expected to be a function and Pulsar calls new on that function
 * to create an instance of the plugin.
 */
PulseWire.packageMeta = require('../package.json');
PulseWire.packageMeta.pulsar = require('../pulsar-plugin.json');
delete PulseWire.packageMeta.main;

module.exports = exports = PulseWire;
