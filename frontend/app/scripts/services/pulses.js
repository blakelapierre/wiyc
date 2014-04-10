// services/pulses.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function PulsesService ($resource, Configuration) {
  var serviceUrl = Configuration.buildApiUrl('/pulses/:pulseId');
  var defaultParameters = null;
  return $resource(serviceUrl, defaultParameters, {
    'list': { 'method': 'GET', 'withCredentials': true },
    'get': { 'method': 'GET', 'withCredentials': true },
    'create': { 'method': 'POST', 'withCredentials': true },
    'update': { 'method': 'PUT', 'withCredentials': true },
    'delete': { 'method': 'DELETE', 'withCredentials': true },
    'createComment': {
      'url': Configuration.buildApiUrl('/pulses/:pulseId/comments'),
      'method': 'POST',
      'withCredentials': true
    }
  });
}

PulsesService.$inject = [
  '$resource',
  'Configuration',
];

angular.module('pulsarClientApp')
.service('Pulses', PulsesService);
