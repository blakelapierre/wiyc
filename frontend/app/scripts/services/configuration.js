

'use strict';

angular.module('robcolbertApp')
.service('Configuration', function Configuration( ) {
  this.tinymceOptions = {
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
});
