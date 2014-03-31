// services/site-settings.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function SiteSettingsService ($resource, Configuration) {
  var serviceUrl = Configuration.buildApiUrl('/settings');
  var defaultParameters = null;
  return $resource(serviceUrl, defaultParameters, {
    'get': { 'method': 'GET', 'withCredentials': true },
    'update': { 'method': 'PUT', 'withCredentials': true }
  });
}

SiteSettingsService.$inject = [
  '$resource',
  'Configuration'
];

angular.module('robcolbertApp').service('SiteSettings', SiteSettingsService);
