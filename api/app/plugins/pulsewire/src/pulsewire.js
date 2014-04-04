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
 *  Implement Pulsar Conversations and real-time messaging using Pulsar's
 *  managed interfaces for ExpressJS (REST API), Mongoose (MongoDB access)
 *  and socket.io.
 *
 *  Pulsar creates a dedicated socket.io channel for plugins requesting
 *  socket.io service. Your plugin generally won't be aware of socket.io
 *  traffic from other plugins using socket.io services on Pulsar.
 *
 *  socket.io implements rooms within channels. Thus, developers can have
 *  group chats happening in rooms provided by socket.io. They will directly
 *  use the socket.io API to manage room memberships. Pulsar "manages"
 *  socket.io in that it hands you the result of on('/YourChannelUUID') as
 *  your "io" instance.
 *
 *  PulseWire will also be the basis for the Pulsar Matchmaking system. More on
 *  that later, but yes, it's a game-centric feature intended to empower game
 *  developers with a truly unique matchmaking platform that can be easily tuned
 *  to your game's specific needs. Not like I haven't built a few of them in
 *  years past.
 *
 *  This is just a fun exercise in, "Here, watch me do that in a fraction of the
 *  time with a better result thanks to MEAN and socket.io." I'd actually like
 *  to print this system out and set it next to a printout of SportsConnect (the
 *  system I built at Sony). I bet it's quite the hilarious difference in
 *  overall lines of code. And, given I wrote SportsConnect entirely along the
 *  async model of Node.js - but had to do that by hand in C++ - I already know
 *  how this is going to perform at scale.
 *
 *  Like...I've gone down into the depths of Node and fucking looked at how it
 *  does things. Same for socket.io. This is going to work just fine (or, I
 *  would *not* be building it).
 *
 * CONNECTION PROCESS
 * 1. Client HTTP requests a session on PulseWire using Pulsar API
 * 2. The PulseWireLoadBalancer selects a host.
 * 3. PulseWire connects to the selected host and requests a session.
 * 4. Host, if possible, reserves a session and generates an auth token.
 * 5. PulseWire passes the host's address, port and auth token back to client.
 * 6. Client connects to selected PulseWire host using socket.io
 * 7. Client presents auth token
 * 8. Host checks token against the token it generated for the session
 *    a. If token matches, proceed to step 9
 *    b. If token does not match, the host closes the socket. [end process]
 * 9. Client enables messaging on PulseWire and configures any loaded plugins
 *    for use with the PulseWire service (it's an event in the reference Pulsar
 *    HTML5 Single-Page Application).
 *
 * HIGHER ORDER CONCEPTS
 * 1. There simply is no "deleteConversation" method. No single user has the
 *    authority to do that. All a user can do is remove themselves from the
 *    conversation. They can even later be added back. To them, it was a
 *    delete. To other members, they "went away" for a while or perhaps
 *    forever.
 * 2. Conversations *are* physically removed from storage when they have no
 *    remaining members. As the last member leaves the conversation, the
 *    conversation record will simply be removed.
 * 3. Some REST calls trigger socket.io transmissions, and those can get
 *    quit out of hand. So, they are fire-n-forget operations. If the plugin
 *    is exhausted, it will just start dropping the real-time message
 *    notifiers and let users get their messages in the message center later.
 *    That's part of the reason why Conversations are backed by the database.
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
  var conversations = new ConversationsController(self);
  var routeAssembler = new RouteAssembler(self.app, self.config);

  serviceUrl = PulseWire.buildServiceUrl(
    '/conversations'
  );
  self.routeAssembler.add({
    'method': 'POST',
    'uri': serviceUrl,
    'controllerMethod': function (req, res) { conversations.createConversation(req, res); }
  });
  self.routeAssembler.add({
    'method': 'GET',
    'uri': serviceUrl,
    'controllerMethod': function (req, res) { conversations.listConversations(req, res); }
  });

  serviceUrl = PulseWire.buildServiceUrl(
    '/conversations/:conversationId'
  );
  self.routeAssembler.add({
    'method': 'GET',
    'uri': serviceUrl,
    'controllerMethod': function (req, res) { conversations.getConversation(req, res); }
  });
  self.routeAssembler.add({
    'method': 'PUT',
    'uri': serviceUrl,
    'controllerMethod': function (req, res) { conversations.updateConversation(req, res); }
  });

  serviceUrl = PulseWire.buildServiceUrl(
    '/conversations/:conversationId/members'
  );
  self.routeAssembler.add({
    'method': 'POST',
    'uri': serviceUrl,
    'controllerMethod': function (req, res) { conversations.addMember(req, res); }
  });
  self.routeAssembler.add({
    'method': 'GET',
    'uri': serviceUrl,
    'controllerMethod': function (req, res) { conversations.listMembers(req, res); }
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
    'controllerMethod': function (req, res) { conversations.getMember(req, res); }
  });
  self.routeAssembler.add({
    'method': 'DELETE',
    'uri': serviceUrl,
    'controllerMethod': function (req, res) { conversations.deleteMember(req, res); }
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
    'controllerMethod': function (req, res) { conversations.listMemberMessages(req, res); }
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
 * INSTANCE METHOD
 *  emitMessage
 *
 * PURPOSE
 *  Deliver a PulseWire Conversations message to all interested parties
 *  who are presently online.
 */
PulseWire.prototype.emitConversationMessage = function (message) {
  this.log.info('pulsewire.emitConversationMessage', message);
  this.io.emit('message', message);
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
