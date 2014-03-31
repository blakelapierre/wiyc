// services/videos.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function VideosService ($resource, Configuration) {
  var serviceUrl = Configuration.buildApiUrl('/videos/:videoId');
  var defaultParameters = null;
  return $resource(serviceUrl, defaultParameters, {
    'create': { 'method': 'POST' },
    'get': { 'method': 'GET' },
    'list': { 'method': 'GET', 'isArray': true },
    'update': { 'method': 'PUT' },
    'delete': { 'method': 'DELETE' },
  });
}

VideosService.$inject = [
  '$resource',
  'Configuration'
];

angular.module('robcolbertApp').service('Videos', VideosService);
