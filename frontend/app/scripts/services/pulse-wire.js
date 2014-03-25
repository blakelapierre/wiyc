/*
 * FILE
 *  services/pulse-wire.js
 *
 * PURPOSE
 *
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
/* global io:false */

function PulseWire($rootScope, $resource, Configuration, UserSession) {

  this.$rootScope = $rootScope;
  this.Configuration = Configuration;
  this.UserSession = UserSession;

  this.open = false;

  this.pulsewireSessions = $resource(
    Configuration.buildApiUrl('/pulsewire/sessions'),
    null,
    {
      'get': { 'method': 'GET' },
      'create': { 'method': 'POST' }
    }
  );

  this.connect();
}

PulseWire.prototype.connect = function ( ) {
  var self = this;

  if (!angular.isDefined(window.io)) {
    return;
  }

  self.pulsewireSessions.create(
    null,
    function onSessionCreateSuccess (session) {
      console.log('socket.io connecting to', session.channelUrl);
      self.socket = io.connect(session.channelUrl);
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

  this.socket.on('hello', function (data) {
    console.log('pulsewire.hello', data);
    self.server = data;
    self.open = true;
    self.$rootScope.$broadcast('pulsewire.hello', data);
  });

  this.socket.on('post', function (data) {
    console.log('pulsewire.post', data);
    self.$rootScope.$broadcast('pulsewire.post', data);
  });

  this.socket.on('comment', function (data) {
    console.log('pulsewire.comment', data);
    self.$rootScope.$broadcast('pulsewire.comment', data);
  });

  this.socket.on('message', function (data) {
    console.log('pulsewire.message', data);
    self.$rootScope.$broadcast('pulsewire.message', data);
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
