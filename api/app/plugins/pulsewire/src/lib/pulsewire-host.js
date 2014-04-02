// lib/pulsewire-host.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

var GUID = require('pulsar-api-framework').tools.GUID;

function PulseWireHost (container, address, port, capacity) {
  var self = this;

  self.container = container;
  self.log = container.container.log;
  self.address = address;
  self.port = port;
  self.capacity = capacity;
  self.clientSessions = [ ];

  /*
   * PRIVATE ATTRIBUTES
   * ... and their accessors
   */

  var _isMarked = false;
  var _markExpireTime = null;

  self.mark = function ( ) {
    _isMarked = true;
    _markExpireTime = new Date(Date.now() + 10000);
    self.log.info('host marked', self);
  };

  self.isMarked = function ( ) {
    if (!_isMarked) {
      return false;
    }

    var currentTime = new Date();
    if (_markExpireTime > currentTime) {
      return true;
    }

    _isMarked = false;
    _markExpireTime = null;

    return false;
  };

}

PulseWireHost.prototype.getMonitorData = function ( ) {
  var monitorData = {
    'address': this.address,
    'port': this.port,
    'maxCapacity': this.capacity,
    'clientSessionCount': this.clientSessions.length.toString()
  };
  return monitorData;
};

PulseWireHost.prototype.getLoadRatio = function ( ) {
  return this.clientSessions.length / this.capacity;
};

PulseWireHost.prototype.createSession = function (callback) {

  /*
   * @TODO - call out to the configured host to actually reserve the session. It
   * will generate the auth token and return it. The callback will then be called
   * with the full session access token to be returned to the client.
   */

  var accessToken = GUID(); //<< faking the needed result from the configured host
  var session = {
    'accessToken': accessToken //<< faked access token
  }

  this.log.info('pulsewireHost.reserveSession', session.accessToken);
  this.clientSessions.push(session);

  /*
   * If the new session request is rejected, use this.mark() to mark the host
   * against consideration by the balancer for 10 seconds. This gets them to back
   * off a bit until the host is happier and helps reduce resource waste.
   */

  if (callback) {
    callback(null, session);
  }
};

PulseWireHost.prototype.getCurrentLoad = function ( ) {
  return this.clientSessions.length / this.capacity;
};

module.exports.PulseWireHost = exports.PulseWireHost = PulseWireHost;
