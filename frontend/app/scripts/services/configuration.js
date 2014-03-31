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

    this.tinymceOptions = {
      'script_url': 'bower_components/tinymce/tinymce.min.js',
      'skin': 'lightgray',
      'theme': 'modern',
      'resize': false,
      'height': 320,
      'fixed_toolbar_container': '#editor-toolbar',
      plugins: [
        'advlist autolink lists link image charmap hr anchor',
        'pagebreak searchreplace wordcount visualblocks visualchars code',
        'insertdatetime media nonbreaking table contextmenu',
        'directionality emoticons paste textcolor'
        // disabled: 'save template fullscreen print preview'
      ],
      'oninit': function ( ) {
        $rootScope.$broadcast('tinymceInitComplete');
      }
    };

    this.sidebarTinymceOptions = {
      'script_url': 'bower_components/tinymce/tinymce.min.js',
      'skin': 'lightgray',
      'theme': 'modern',
      'resize': false,
      'height': 200,
      'fixed_toolbar_container': '#editor-toolbar',
      plugins: [
        'advlist autolink lists link image charmap hr anchor',
        'pagebreak searchreplace wordcount visualblocks visualchars code',
        'insertdatetime media nonbreaking save table contextmenu',
        'directionality emoticons paste textcolor'
      ],
      'oninit': function ( ) {
        $rootScope.$broadcast('tinymceInitComplete');
      }
    };

  }
]);
