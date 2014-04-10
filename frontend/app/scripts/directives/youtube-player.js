// directives/youtube-player.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function PulsarYoutubePlayerDirective ( ) {
  return {
    template: '<div></div>',
    restrict: 'E',
    link: function postLink (scope, element/*, attrs*/) {
      element.text('this is the pulsarYoutubePlayer directive');
    }
  };
}

angular.module('pulsarClientApp')
.directive('pulsarYoutubePlayer', PulsarYoutubePlayerDirective);
