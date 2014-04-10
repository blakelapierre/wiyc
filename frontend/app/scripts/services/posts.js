// services/posts.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function PostsService ($resource, Configuration) {
  var serviceUrl = Configuration.buildApiUrl('/posts/:postId');
  var defaultParameters = null;
  return $resource(serviceUrl, defaultParameters, {
    'list': { 'method': 'GET', 'withCredentials':true },
    'get': { 'method': 'GET', 'withCredentials':true },
    'create': { 'method': 'POST', 'withCredentials':true },
    'update': { 'method': 'PUT', 'withCredentials':true },
    'delete': { 'method': 'DELETE', 'withCredentials':true },
    'createComment': {
      'url': Configuration.buildApiUrl('/posts/:postId/comments'),
      'method': 'POST',
      'withCredentials':true
    }
  });
}

PostsService.$inject = [
  '$resource',
  'Configuration'
];

angular.module('pulsarClientApp')
.service('Posts', PostsService);
