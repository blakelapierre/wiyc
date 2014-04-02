// pulsewire-client.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

var PulseWireHost = require('./pulsewire-host.js').PulseWireHost;

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
  this.log.info('pulsewire host', host.getMonitorData());
  this.hosts.push(host);
};

/*
 * The idea is to ask each host for its relative load as a ratio of its
 * current session count versus its capacity. A server that can handle 200
 * total sessions at max capcity views 20 sessions much differently than a
 * server that can handle 2,000 sessions at max capacity. This balancer
 * considers this factor when selecting the host with the lowest load, and is
 * the reason Pulsar performs its own load balancing for PulseWire sessions.
 *
 * This is a model. It is intended to be a best practice on Pulsar. You may,
 * as a developer, wire up whatever kind of load balancing you want including
 * simply leveraging a hardware load balancer and sending sessions to your
 * farm however you see fit. I impose no restrictions. Load is your problem,
 * and this is a model for how I would choose to scale this kind of service.
 */

PulseWireLoadBalancer.prototype.createSessionOnChannel = function (channel, callback) {

  if (!channel) {
    throw new Error('must specify channel when calling createSessionOnChannel');
  }
  if (!callback) {
    throw new Error('must specify callback when calling createSessionOnChannel');
  }

  var self = this;
  var bestHost = null;

  /*
   * @TODO wants to be: self.hosts[channel].forEach( ... )
   *
   * That is what would allow a Pulsar admin to configure banks of hosts
   * dedicated to individual plugins if the need arises. So, when it does, this
   * is where to go "bigger" in the Pulsar codebase, then refactor the
   * configuration options to express a map of arrays rather than a simple
   * array. -Rob
   */

  self.hosts.forEach(function (host) {

    if (host.isMarked()) {
      return; // you're useless
    }

    if (host.sessions >= host.capacity) {
      return; // you're maxed out
    }

    if (bestHost === null) {
      bestHost = host; // I need at least ONE host. You're it.
      return;
    }

    if (host.getLoadRatio() >= bestHost.getLoadRatio()) {
      return; // you're relatively more stressed than bestHost
    }

    bestHost = host; // Congratulations! You're the new bestHost.

  });

  // No registered hosts or the network has gone completely bonkers
  if (bestHost === null) {
    self.log.error('PULSEWIRE CONFIGURED LOAD BALANCER MAX CAPACITY REACHED');
    return null; // no available sessions in the configured network
  }

  // Ask the host to reserve a session for this fine Pulsar user and their bad
  // self. The response is handed off to the caller.
  bestHost.createSession(function (err, session) {
    if (err) {
      callback(err, null);
      return;
    }
    session.host = {
      'address': bestHost.address,
      'port': bestHost.port
    };
    callback(err, session);
  });

};

module.exports = exports = PulseWireLoadBalancer;
