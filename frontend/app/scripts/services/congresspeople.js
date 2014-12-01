// services/congressperson.js
// Copyright (C) 2014 Blake La Pierre <blakelapierre@gmail.com>
// License: MIT

'use strict';

function CongresspeopleService ($resource, Configuration) {
  var serviceUrl = Configuration.buildApiUrl('/congresspeople/:name');
  var defaultParameters = null;
  return $resource(serviceUrl, defaultParameters, {
    'list': { 'method': 'GET', 'withCredentials':true },
    'get': { 'method': 'GET', 'withCredentials':true },
    'createComment': {
      'url': Configuration.buildApiUrl('/congresspeople/:name/comments'),
      'method': 'POST',
      'withCredentials':true
    }
  });
}

CongresspeopleService.$inject = [
  '$resource',
  'Configuration'
];

angular.module('wiyc')
.service('Congresspeople', CongresspeopleService);
