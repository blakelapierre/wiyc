// services/pulse-wire.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

function PulseWire($rootScope, Configuration, UserSession) {
  this.$rootScope = $rootScope;
  this.Configuration = Configuration;
  this.UserSession = UserSession;
  this.open = false;
  this.connect();
}

PulseWire.prototype.connect = function ( ) {
  return;
//   var connectUrl = this.Configuration.buildApiUrl('/');
//   //connectUrl = 'http://localhost:10010/';
//   console.log('socket.io connecting to', connectUrl);
//   this.socket = io.connect(connectUrl);
//   this.attach();
};

PulseWire.prototype.emit = function (/* eventName, eventData */) {
//   this.socket.emit(eventName, eventData);
};

PulseWire.prototype.attach = function ( ) {
  return;
//   var self = this;
//
//   this.socket.on('hello', function (data) {
//     console.log('pulsewire.hello', data);
//     self.server = data;
//     self.open = true;
//     self.$rootScope.$broadcast('pulsewire.hello', data);
//   });
//
//   this.socket.on('post', function (data) {
//     console.log('pulsewire.post', data);
//     self.$rootScope.$broadcast('pulsewire.post', data);
//   });
//
//   this.socket.on('thought', function (data) {
//     console.log('pulsewire.thought', data);
//     self.$rootScope.$broadcast('pulsewire.thought', data);
//   });
//
//   this.socket.on('comment', function (data) {
//     console.log('pulsewire.comment', data);
//     self.$rootScope.$broadcast('pulsewire.comment', data);
//   });
//
//   this.socket.on('mail', function (data) {
//     console.log('pulsewire.mail', data);
//     self.$rootScope.$broadcast('pulsewire.mail', data);
//   });
//
//   this.socket.on('message', function (data) {
//     console.log('pulsewire.message', data);
//     self.$rootScope.$broadcast('pulsewire.message', data);
//   });
};

PulseWire.$inject = [
  '$rootScope',
  'Configuration',
  'UserSession'
];

angular.module('robcolbertApp')
.service('PulseWire', PulseWire);
