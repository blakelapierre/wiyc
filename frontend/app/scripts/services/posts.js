// services/posts.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

angular.module('robcolbertApp')
.service('Posts', [
  '$resource',
  function Posts ($resource) {
    var serviceUrl = 'http://localhost:3000/posts/:postId';
    var defaultParameters = null;
    return $resource(serviceUrl, defaultParameters, {
      'list': { 'method': 'GET', 'isArray': true },
      'get': { 'method': 'GET' },
      'create': { 'method': 'POST' },
      'update': { 'method': 'PUT' },
      'delete': { 'method': 'DELETE' },
      'createComment': {
        'url': 'http://localhost:3000/posts/:postId/comments',
        'method': 'POST'
      }
    });
  }
]);
