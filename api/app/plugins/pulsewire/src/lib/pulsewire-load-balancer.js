// pulsewire-client.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

var PulseWireHost = require('./pulsewire-host.js');

function PulseWireLoadBalancer (container, hosts) {

  this.container = container;
  this.hosts = [ ];
  this.log = container.app.log;

}

PulseWireLoadBalancer.prototype.addHost = function (hostDefinition) {
  var host = new PulseWireHost(
    this,
    hostDefinition.address,
    hostDefinition.port,
    hostDefinition.capacity
  );
  this.log.info('pulsewire host', hostDefinition);
  this.hosts.push(host);
};

PulseWireLoadBalancer.prototype.selectHostForChannel = function (req, res, channel) {

  var host = {
    'address': 'api.robcolbert.com',//this.container.config.bind.address,
    'port': this.container.config.bind.port
  };
  this.log.info('lb.selectHostForChannel', host);
  return host;
};

module.exports = exports = PulseWireLoadBalancer;
