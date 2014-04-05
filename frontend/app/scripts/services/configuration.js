// services/configuration.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function ConfigurationService ( ) {

  var feServer = {
    'scheme': 'http://',
    'host': '127.0.0.1:9000'
    //'host': 'robcolbert.com'
  };
  this.getFrontEndHost = function ( ) { return feServer.host; };

  var apiServer = {
    'scheme': 'http://',
    'host': '127.0.0.1',
    //'host': 'api.robcolbert.com',
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
      'height': '125px'
    },
    'full': {
      'skin': 'bootstrapck',
      'language':'en',
      'uiColor':'#e8e8e8',
      'height': '250px'
    }
  };

}

ConfigurationService.$inject = [

];

angular.module('pulsarApp')
.service('Configuration', ConfigurationService);
