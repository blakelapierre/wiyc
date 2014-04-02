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
 *
 * PROCESS
 * 1. Client HTTP requests a session on PulseWire using Pulsar API
 * 2. The PulseWireLoadBalancer selects a host.
 * 3. PulseWire connects to the selected host and requests a session.
 * 4. Host, if possible, reserves a session and generates an auth token.
 * 5. PulseWire passes the host's address, port and auth token back to client.
 *
 * 6. Client connects to selected PulseWire host using socket.io
 * 7. Client presents auth token
 * 8. Host checks token against the token it generated for the session
 *    a. If token matches, proceed to step 9
 *    b. If token does not match, the host closes the socket. [end process]
 * 9. Client enables messaging on PulseWire and configures any loaded plugins
 *    for use with the PulseWire service (it's an event in the reference Pulsar
 *    HTML5 Single-Page Application).
 */
function PulseWire (app, http, config) {

  var self = this;

  self.packageMeta = PulseWire.packageMeta;
  self.config = config;
  self.app = app;
  self.log = app.log;
  self.http = http;
  self.config = config;

  self.clients = [ ];

  self.loadBalancer = new PulseWireLoadBalancer(self);
  self.packageMeta.pulsar.socketio.hosts.forEach(function (host) {
    self.loadBalancer.addHost(host);
  });

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
  var self = this;
  var channelUuid = PulseWire.packageMeta.pulsar.socketio.channelUuid;
  self.loadBalancer.createSessionOnChannel(
    channelUuid,
    function (err, session) {
      if (err) {
        res.json(500, err);
        return;
      }
      session.channel = channelUuid;
      req.session.pulsewire = session;
      res.json(200, req.session.pulsewire);
    }
  );
};

PulseWire.prototype.getChannelUrl = function (req, res, channel) {
  var self = this;
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
