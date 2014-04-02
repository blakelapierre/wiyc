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

  self.routeAssembler = new RouteAssembler(self.app, self.config);
  self.clients = [ ];

  self.loadBalancer = new PulseWireLoadBalancer(self);
  self.packageMeta.pulsar.socketio.hosts.forEach(function (host) {
    self.loadBalancer.addHost(host);
  });

  /*
   * MODELS
   */
  require('./server/models/conversations');

}

/*
 * STATIC METHOD
 *  buildServiceUrl (url)
 *
 * PURPOSE
 *  Builds a service URL that considers pulsar-plugin.mountPoint.
 */
PulseWire.buildServiceUrl = function (url) {
  return PulseWire.packageMeta.pulsar.mountPoint + url;
};

PulseWire.onClientConnection = function (socket) {
  return PulseWire.instance.onClientConnection(socket);
};

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
  self.injectSessionRoutes();
  self.injectConversationsRoutes();
  self.io.on('connection', PulseWire.onClientConnection);
};

PulseWire.prototype.injectSessionRoutes = function ( ) {
  var self = this;
  var serviceUrl = PulseWire.buildServiceUrl('/sessions');
  self.routeAssembler.add({
    'method': 'POST',
    'uri': serviceUrl,
    'controllerMethod': function (req, res) { return self.createUserSession(req,res); }
  });
  self.routeAssembler.add({
    'method': 'GET',
    'uri': serviceUrl,
    'controllerMethod': function (req, res) { return self.getUserSession(req, res); }
  });
};

PulseWire.prototype.injectConversationsRoutes = function ( ) {
  var self = this;
  var serviceUrl;

  var ConversationsController = require('./server/controllers/conversations');
  var conversations = new ConversationsController(this.app, this.config);
  var routeAssembler = new RouteAssembler(self.app, self.config);

  serviceUrl = PulseWire.buildServiceUrl(
    '/conversations'
  );
  self.routeAssembler.add({
    'method': 'POST',
    'uri': serviceUrl,
    'controllerMethod': function (req, res) { conversations.create(req, res); }
  });
  self.routeAssembler.add({
    'method': 'GET',
    'uri': serviceUrl,
    'controllerMethod': function (req, res) { conversations.list(req, res); }
  });

  serviceUrl = PulseWire.buildServiceUrl(
    '/conversations/:conversationId'
  );
  self.routeAssembler.add({
    'method': 'GET',
    'uri': serviceUrl,
    'controllerMethod': function (req, res) { conversations.get(req, res); }
  });
  self.routeAssembler.add({
    'method': 'PUT',
    'uri': serviceUrl,
    'controllerMethod': function (req, res) { conversations.update(req, res); }
  });

  serviceUrl = PulseWire.buildServiceUrl(
    '/conversations/:conversationId/members'
  );
  self.routeAssembler.add({
    'method': 'POST',
    'uri': serviceUrl,
    'controllerMethod': function (req, res) { conversations.addParticipant(req, res); }
  });
  self.routeAssembler.add({
    'method': 'GET',
    'uri': serviceUrl,
    'controllerMethod': function (req, res) { conversations.listParticipants(req, res); }
  });

  /*
   * INDIVIDUAL USER
   */
  serviceUrl = PulseWire.buildServiceUrl(
    '/conversations/:conversationId/members/:userId'
  );
  self.routeAssembler.add({
    'method': 'GET',
    'uri': serviceUrl,
    'controllerMethod': function (req, res) { conversations.getParticipant(req, res); }
  });
  self.routeAssembler.add({
    'method': 'DELETE',
    'uri': serviceUrl,
    'controllerMethod': function (req, res) { conversations.removeParticipant(req, res); }
  });

  /*
   * INDIVIDUAL MEMBER'S MESSAGES COLLECTION
   */
  serviceUrl = PulseWire.buildServiceUrl(
    '/conversations/:conversationId/members/:userId/messages'
  );
  self.routeAssembler.add({
    'method': 'GET',
    'uri': serviceUrl,
    'controllerMethod': function (req, res) { conversations.listParticipantMessages(req, res); }
  });

  /*
   * MESSAGES COLLECTION
   */
  serviceUrl = PulseWire.buildServiceUrl(
    '/conversations/:conversationId/messages'
  );
  self.routeAssembler.add({
    'method': 'POST',
    'uri': serviceUrl,
    'controllerMethod': function (req, res) { conversations.createMessage(req, res); }
  });
  self.routeAssembler.add({
    'method': 'GET',
    'uri': serviceUrl,
    'controllerMethod': function (req, res) { conversations.listMessages(req, res); }
  });

  /*
   * INDIVIDUAL MESSAGES
   */
  serviceUrl = PulseWire.buildServiceUrl(
    '/conversations/:conversationId/messages/:messageId'
  );
  self.routeAssembler.add({
    'method': 'GET',
    'uri': serviceUrl,
    'controllerMethod': function (req, res) { conversations.getMessage(req, res); }
  });
  self.routeAssembler.add({
    'method': 'PUT',
    'uri': serviceUrl,
    'controllerMethod': function (req, res) { conversations.updateMessage(req, res); }
  });
  self.routeAssembler.add({
    'method': 'DELETE',
    'uri': serviceUrl,
    'controllerMethod': function (req, res) { conversations.deleteMessage(req, res); }
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
 */
PulseWire.prototype.stop = function ( ) {
  var self = this;
  self.io.removeListener('connection', PulseWire.onClientConnection);
  self.routeAssembler.detach();
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

  // make sure only authenticated users receive new PulseWire sessions
  if (!self.app.checkAuthentication(req, res, 'Only authenticated users can request PulseWire sessions')) {
    return;
  }

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

/*
 * REST METHOD
 *  getUserSession
 *
 * PURPOSE
 *  Retrieves the authenticated user's PulseWire session, if any.
 */
PulseWire.prototype.getUserSession = function (req, res) {
  var self = this;
  if (!self.app.checkAuthentication(req, res, 'Only authenticated users can retrieve their PulseWire session')) {
    return;
  }
  if (!req.session.pulsewire) {
    res.json(404, {'message':'No PulseWire session currently exists'});
    return;
  }
  res.json(200, req.session.pulsewire);
};

/*
 * SOCKET.IO EVENT
 *  onClientConnection
 *
 * PURPOSE:
 *  Called when socket.io receives an ingress connection/socket. Wraps the
 *  PulseWire prototocol around the socket presented with closures for
 *  PulseWire protocol message handlers.
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
