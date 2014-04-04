// services/pulse-wire.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';
/* global io:false */

function PulseWire($rootScope, $resource, Configuration) {

  var self = this;

  self.$rootScope = $rootScope;
  self.Configuration = Configuration;
  self.userSession = null;

  self.socket = null;
  self.open = false;

  self.pulsewireSessions = $resource(
    Configuration.buildApiUrl('/pulsewire/sessions'),
    null,
    {
      'get': { 'method': 'GET', 'withCredentials': true },
      'create': { 'method': 'POST', 'withCredentials': true }
    }
  );

  $rootScope.$on('setUserSession', function (event, userSession) {
    self.userSession = userSession;
    if (userSession.authenticated.status) {
      self.connect();
    } else {
      if (self.socket !== null) {
        self.socket.close();
        self.socket = null;
      }
    }
  });

}

PulseWire.prototype.connect = function ( ) {
  var self = this;

  if (!angular.isDefined(window.io)) {
    return;
  }

  console.log('requesting new PulseWire user session');
  self.pulsewireSessions.create(
    null,
    function onSessionCreateSuccess (session) {
      console.log('PulseWire user session', session);

      self.session = session;
      self.session.connected = false;

      self.session.channelUrl = 'http://'+session.host.address.toString()+':'+session.host.port.toString()+'/'+session.channel;
      console.log('socket.io connecting to', self.session);
      self.socket = io.connect(self.session.channelUrl);
      self.attach();
    },
    function onSessionCreateError (error) {
      console.log('failed to connect to PulseWire', error);
    }
  );
};

PulseWire.prototype.emit = function (eventName, eventData) {
  this.socket.emit(eventName, eventData);
};

PulseWire.prototype.attach = function ( ) {
  var self = this;
  var $rootScope = self.$rootScope;

  self.socket.on('connect', function ( ) {
    self.session.connected = true;
    console.log('PulseWire connected, sending hello');
    $rootScope.$broadcast('displayMessage', 'PulseWire authenticating');
    self.socket.emit('hello', {
      'userId': self.userSession.user._id,
      'accessToken': self.session.accessToken
    });
  });

  self.socket.on('hello', function (data) {
    console.log('pulsewire.hello', data);
    self.server = data;
    self.open = true;
    $rootScope.$broadcast('pulsewire.hello', data);
    $rootScope.$broadcast('displayMessage', 'PulseWire <strong>online</strong>');
  });

  self.socket.on('post', function (data) {
    console.log('pulsewire.post', data);
    $rootScope.$broadcast('pulsewire.post', data);
  });

  self.socket.on('comment', function (data) {
    console.log('pulsewire.comment', data);
    $rootScope.$broadcast('pulsewire.comment', data);
  });

  self.socket.on('message', function (data) {
    console.log('pulsewire.message', data);
    $rootScope.$broadcast('pulsewire.message', data);
  });
};

PulseWire.$inject = [
  '$rootScope',
  '$resource',
  'Configuration',
  'UserSession'
];

angular.module('robcolbertApp')
.service('PulseWire', PulseWire);
