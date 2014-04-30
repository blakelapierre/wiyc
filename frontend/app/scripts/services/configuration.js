// services/configuration.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function ConfigurationService ( ) {

  var feServer = {
    'scheme': 'http://',
    //'host': '127.0.0.1:9000'
    'host': 'robcolbert.com'
  };
  this.getFrontEndHost = function ( ) { return feServer.host; };

  var apiServer = {
    'scheme': 'http://',
    //'host': '127.0.0.1',
    'host': 'api.robcolbert.com',
    'port': 10010
  };
  this.buildApiUrl = function (endpoint) {
    return apiServer.scheme + apiServer.host + ':' + apiServer.port + endpoint;
  };

  this.ckeditorOptions = {
    'small': {
      'skin': 'bootstrapck',
      'language':'en',
      'uiColor':'#e8e8e8',
      'height': '125px',
      'extraPlugins': 'iframe,colordialog,widget',
      'extraAllowedContent': 'iframe'
    },
    'full': {
      'skin': 'bootstrapck',
      'language':'en',
      'uiColor':'#e8e8e8',
      'height': '250px',
      'extraPlugins': 'iframe,colordialog,widget',
      'extraAllowedContent': 'iframe'
    }
  };

  //TODO move this to a service call so I can data-drive the available choices.
  this.pulseStatuses = [
    { 'value': 'draft',     'label': 'Working Draft' },
    { 'value': 'published', 'label': 'Published' },
    { 'value': 'trash',     'label': 'Trash' }
  ];

}

ConfigurationService.$inject = [

];

angular.module('pulsarClientApp')
.service('Configuration', ConfigurationService);
