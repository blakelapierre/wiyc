// directives/pulse.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function PulsarPulseDirective ($compile) {
  return {
    templateUrl: 'views/directives/pulse.html',
    restrict: 'E',
    link: function postLink(scope, element/*, attrs*/) {
      scope.$watch('pulse.excerpt', function ( ) {
        element.find('.body .excerpt').append($compile(scope.pulse.excerpt)(scope));
      });
      scope.$watch('pulse.content', function ( ) {
        element.find('.body .content').append($compile(scope.pulse.content)(scope));
      });
    }
  };
}

PulsarPulseDirective.$inject = [
  '$compile'
];

angular.module('pulsarClientApp')
.directive('pulsarPulse', PulsarPulseDirective);
