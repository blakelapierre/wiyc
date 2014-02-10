// services/thoughts.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

angular.module('robcolbertApp')
.service('Thoughts', ['$resource', function Thoughts ($resource) {
  return $resource('http://127.0.0.1:3000/thoughts/:id', null, {
    'list': { 'method': 'GET', 'isArray': true },
    'get': { 'method': 'GET', 'isArray': true },
    'create': { 'method': 'POST' },
    'update': { 'method': 'PUT' },
    'delete': { 'method': 'DELETE' }
  });
}]);
