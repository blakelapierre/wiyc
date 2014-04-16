// directives/soundcloud-player.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function PulsarSoundcloudPlayerDirective ( ) {
  return {
    templateUrl: 'views/directives/soundcloud-player.html',
    restrict: 'E',
    link: function postLink (scope, element, attrs) {
      scope.message = attrs.starlightMessage;
    }
  };
}

PulsarSoundcloudPlayerDirective.$inject = [

];

angular.module('pulsarClientApp')
.directive('pulsarSoundcloudPlayer', PulsarSoundcloudPlayerDirective);
