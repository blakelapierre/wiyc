

'use strict';

angular.module('robcolbertApp')
.service('Configuration', function Configuration( ) {

  this.tinymceOptions = {
    'script_url': 'bower_components/tinymce/tinymce.min.js',
    'skin': 'lightgray',
    'theme': 'modern',
    'resize': false,
    'height': 320,
    'fixed_toolbar_container': '#editor-toolbar',
    plugins: [
      'advlist autolink lists link image charmap print preview hr anchor pagebreak',
      'searchreplace wordcount visualblocks visualchars code fullscreen',
      'insertdatetime media nonbreaking save table contextmenu directionality',
      'emoticons template paste textcolor'
    ]
  };

  var apiServer = {
    'scheme': 'http://',
//  'host': 'localhost',
    'host': 'robcolbert.com',
    'port': 10010
  };

  this.buildApiUrl = function (endpoint) {
    return apiServer.scheme + apiServer.host + ':' + apiServer.port + endpoint;
  };

});
