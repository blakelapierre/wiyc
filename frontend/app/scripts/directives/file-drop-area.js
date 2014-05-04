'use strict';

/*
  Place on an element to turn it into a drop area
  (as in drag-and-drop-your-native-icon/files-right-onto-the-physical-representation-of-this-DOM-element)
  for files.

  When that happens (a drop), angular does it's magic and an HTML5 File object will be sitting on your
  $scope.

  Example:

  <div file-drop-area="droppedFile">pretty-teaser-bs-goes-here</div> 

*/

function PulsarFileDropAreaDirective ( ) {
  function processDragOverEnter(e) {
    e.preventDefault();
    e.dataTransfer.effectAllowed = 'copy';
    return false;
  };

  return {
    'restrict': 'A',
    'scope': {
      'file': '=fileDropArea'
    },
    'link': function fileDropAreaLink (scope, element, attrs) {
      element.bind('dragover', processDragOverEnter);
      element.bind('dragenter', processDragOverEnter);

      element.bind('drop', function(e) {
        e.preventDefault();

        scope.file = e.dataTransfer.files[0];

        return false;
      });
    }
  };
}

PulsarFileDropAreaDirective.$inject = [
];

angular.module('pulsarClientApp')
.directive('fileDropArea', PulsarFileDropAreaDirective);
