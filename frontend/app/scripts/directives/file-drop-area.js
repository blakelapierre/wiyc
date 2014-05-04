'use strict';

/*
  Place on an element to turn it into a drop area
  (as in drag-and-drop-your-native-icon/files-right-onto-the-physical-representation-of-this-DOM-element)
  for files.

  When that happens (a drop), angular does its magic and an HTML5 File object will be sitting on your
  $scope.

  Example:

  <div file-drop-area="droppedFile">pretty-teaser-bs-goes-here</div> 

*/

function PulsarFileDropAreaDirective ( ) {
  function processDragOverEnter (e) {
    e.preventDefault();
    e.originalEvent.dataTransfer.effectAllowed = 'copy'; // It looks like these are jQuery events coming in?!
    return false;
  }

  return {
    'restrict': 'A',
    'scope': {
      'file': '=fileDropArea'
    },
    'link': function fileDropAreaLink (scope, element, attrs) {
      var fileType = attrs.fileDropAreaType,
          fileTypeRegExp = fileType ? new RegExp(fileType) : /.*/;

      element.bind('dragover', processDragOverEnter);
      element.bind('dragenter', processDragOverEnter);

      element.bind('drop', function(e) {
        e.preventDefault();

        var file = e.originalEvent.dataTransfer.files[0]; // It looks like these are jQuery events coming in?!

        if (file) {
          if (fileTypeRegExp.test(file.type)) {
            scope.file = file;
          }
          else {
            scope.file = undefined;
          }
        }
        else {
          scope.file = undefined;
        }
        
        return false;
      });
    }
  };
}

PulsarFileDropAreaDirective.$inject = [
];

angular.module('pulsarClientApp')
.directive('fileDropArea', PulsarFileDropAreaDirective);
