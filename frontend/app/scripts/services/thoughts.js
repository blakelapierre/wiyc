// services/thoughts.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

angular.module('robcolbertApp')
.service('Thoughts', [
  '$resource',
  'Configuration',
  function Thoughts ($resource, Configuration) {
    var serviceUrl = Configuration.buildApiUrl('/thoughts/:id');
    console.log('Thoughts service endpoint', serviceUrl);
    var defaultParameters = null;
    return $resource(serviceUrl, defaultParameters, {
      'list': { 'method': 'GET', 'isArray': true },
      'get': { 'method': 'GET', 'isArray': true },
      'create': { 'method': 'POST' },
      'update': { 'method': 'PUT' },
      'delete': { 'method': 'DELETE' }
    });
  }
]);

