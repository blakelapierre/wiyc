// services/posts.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

function PostsService ($resource, Configuration) {
  var serviceUrl = Configuration.buildApiUrl('/posts/:postId');
  var defaultParameters = null;
  return $resource(serviceUrl, defaultParameters, {
    'list': { 'method': 'GET', 'isArray': true },
    'get': { 'method': 'GET' },
    'create': { 'method': 'POST' },
    'update': { 'method': 'PUT' },
    'delete': { 'method': 'DELETE' },
    'createComment': {
      'url': Configuration.buildApiUrl('/posts/:postId/comments'),
      'method': 'POST'
    }
  });
}

PostsService.$inject = [
  '$resource',
  'Configuration'
];

angular.module('robcolbertApp')
.service('Posts', PostsService);
