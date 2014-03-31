// services/users.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function UsersService ($resource, Configuration) {
  var serviceUrl = Configuration.buildApiUrl('/users/:userId');
  var verifyUrl = Configuration.buildApiUrl('/users/:userId/verify');
  var defaultParameters = null;
  return $resource(serviceUrl, defaultParameters, {
    'create': { 'method': 'POST' },
    'verify': { 'method': 'POST', 'url': verifyUrl },
    'get': { 'method': 'GET' },
    'update': { 'method': 'PUT' },
    'delete': { 'method': 'DELETE' },
    'list': { 'method': 'GET', 'isArray': true }
  });
}

UsersService.$inject = [
  '$resource',
  'Configuration'
];

angular.module('robcolbertApp')
.service('Users', UsersService);
