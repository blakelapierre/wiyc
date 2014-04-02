// pulsewire-client.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function PulseWireClient (container, socket) {

  var self = this;

  self.container = container;
  self.socket = socket;

  self.socket
  .on('hello', function onClientHello(hello) { return self.onHello(hello); })
  .on('goodbye', function onClientGoodbye (goodbye) { return self.onGoodbye(goodbye); });

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
  this.container.app.log.info('sending HELLO message');
  this.socket.emit('hello', {
    'pulsewire': this.container.packageMeta
  });
};

PulseWireClient.prototype.onHello = function (hello) {
  this.container.app.log.info('HELLO received', hello.accessToken);
  this.sendHelloMessage();
};

PulseWireClient.prototype.onGoodbye = function ( ) {
  this.socket.close();
  this.container
};

module.exports = exports = PulseWireClient;
