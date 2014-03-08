// services/configuration.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

angular.module('robcolbertApp')
.service('Configuration', [
  '$rootScope',
  function Configuration ($rootScope) {

    var apiServer = {
      'scheme': 'http://',
      'host': 'localhost',
      //'host': '192.241.240.182',
      //'host': 'robcolbert.com',
      'port': 10010
    };

    this.tinymceOptions = {
      'script_url': 'bower_components/tinymce/tinymce.min.js',
      'skin': 'lightgray',
      'theme': 'modern',
      'resize': false,
      'height': 320,
      'fixed_toolbar_container': '#editor-toolbar',
      plugins: [
        'advlist autolink lists link image charmap print preview hr anchor',
        'pagebreak searchreplace wordcount visualblocks visualchars code',
        'fullscreen insertdatetime media nonbreaking save table contextmenu',
        'directionality emoticons template paste textcolor'
      ],
      'oninit': function ( ) {
        $rootScope.$broadcast('tinymceInitComplete');
      }
    };

    this.buildApiUrl = function (endpoint) {
      return apiServer.scheme + apiServer.host + ':' + apiServer.port + endpoint;
    };
  }
]);
