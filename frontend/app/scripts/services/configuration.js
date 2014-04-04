// services/configuration.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

angular.module('robcolbertApp')
.service('Configuration', [
  '$rootScope',
  function Configuration ($rootScope) {

    var feServer = {
      'scheme': 'http://',
      //'host': 'localhost'
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
      'full': {
        'skin': 'bootstrapck',
        'language':'en',
        'uiColor':'#e8e8e8',
        'height': '250px'
      },
      'small': {
        'skin': 'bootstrapck',
        'language':'en',
        'uiColor':'#e8e8e8',
        'height': '125px'
      }
    };

  }
]);
