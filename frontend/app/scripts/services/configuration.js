/*
 * FILE
 *  services/configuration.js
 *
 * PURPOSE
 *
 * LICENSE
 *  Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to
 *  deal in the Software without restriction, including without limitation the
 *  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 *  sell copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 *  IN THE SOFTWARE.
 */

'use strict';

angular.module('robcolbertApp')
.service('Configuration', [
  '$rootScope',
  function Configuration ($rootScope) {

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

    var feServer = {
      'scheme': 'http://',
      'host': 'localhost'
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
  }
]);
