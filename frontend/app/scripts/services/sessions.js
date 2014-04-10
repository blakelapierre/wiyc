// services/sessions.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function SessionsService ($resource, Configuration) {
  var serviceUrl = Configuration.buildApiUrl('/sessions');
  var defaultParameters = null;
  return $resource(serviceUrl, defaultParameters, {
    'get': { 'method': 'GET', 'withCredentials': true },
    'create': { 'method': 'POST', 'withCredentials': true },
    'delete': { 'method': 'DELETE', 'withCredentials': true }
  });
}

SessionsService.$inject = [
  '$resource',
  'Configuration',
];

angular.module('pulsarClientApp')
.service('Sessions', SessionsService);
