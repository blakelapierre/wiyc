// services/users.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function UsersService ($resource, Configuration) {

  var serviceUrl = Configuration.buildApiUrl('/users/:userId');
  var verifyServiceUrl = Configuration.buildApiUrl('/users/:userId/verify');
  var requestPasswordResetUrl = Configuration.buildApiUrl('/users/request-password-reset');
  var executePasswordResetUrl = Configuration.buildApiUrl('/users/execute-password-reset');
  var defaultParameters = null;

  return $resource(serviceUrl, defaultParameters, {
    'create': { 'method': 'POST' },
    'verify': { 'method': 'POST', 'url': verifyServiceUrl },
    'get': { 'method': 'GET' },
    'update': { 'method': 'PUT' },
    'requestPasswordReset': { 'method': 'POST', 'url': requestPasswordResetUrl },
    'executePasswordReset': { 'method': 'POST', 'url': executePasswordResetUrl },
    'delete': { 'method': 'DELETE' },
    'list': { 'method': 'GET', 'isArray': true }
  });

}

UsersService.$inject = [
  '$resource',
  'Configuration'
];

angular.module('pulsarClientApp')
.service('Users', UsersService);
