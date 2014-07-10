// services/configuration.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function ConfigurationService ( ) {

  var feServer = {
    'scheme': 'http://',
    //'host': '127.0.0.1:8080'
    //'host': '127.0.0.1:9000'
    'host': 'robcolbert.com'
  };
  this.getFrontEndHost = function ( ) { return feServer.host; };

  var apiServer = {
    'scheme': 'http://',
    //'host': '127.0.0.1',
    'host': 'robcolbert.com',
    'port': 80
    //'port': 8080
  };
  this.buildApiUrl = function (endpoint) {
    var url = apiServer.scheme + apiServer.host;
    if (apiServer.port !== 80) {
      url += ':' + apiServer.port;
    }
    return url + endpoint;
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

  //TODO move these to a service call so I can data-drive the available choices.
  this.pulseStatuses = [
    { 'value': 'draft',     'label': 'Working Draft' },
    { 'value': 'published', 'label': 'Published' },
    { 'value': 'trash',     'label': 'Trash' }
  ];
  this.pulseVisibilityValues = [
    { 'value': 'public', 'label': 'Public' },
    { 'value': 'contacts', 'label': 'Contacts Only' },
    { 'value': 'private', 'label': 'Private' }
  ];
  //TODO end

}

ConfigurationService.$inject = [

];

angular.module('pulsarClientApp')
.service('Configuration', ConfigurationService);
