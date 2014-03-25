// pulsewire-client.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function PulseWireClient (container, socket) {

  var self = this;

  this.container = container;
  this.socket = socket;

  this.socket
  .on('hello', function onClientHello(authToken) { return self.onHello(authToken); })
  .on('goodbye', function onClientGoodbye (data) { return self.onGoodbye(data); });

  this.sendHelloMessage();

}

/*
 * SOCKET.IO EMITTER: 'hello'
 * PURPOSE:
 * Sends the PulseWire hello messsage to the connected browser client. This
 * message lets the client show certain 'About' data for the PulseWire plugin
 * and confirms that the data channel is open and messages are passing
 * correctly.
 */

PulseWireClient.prototype.sendHelloMessage = function ( ) {
  container.app.log.info('sending HELLO message');
  this.socket.emit('hello', {
    'pulsewire': PulseWire.packageMeta
  });
};

PulseWireClient.prototype.onHello = function (authToken) {
  this.socket.emit('hello', {
    'pulsewire': PulseWire.packageMeta
  });
};

module.exports = exports = PulseWireClient;
