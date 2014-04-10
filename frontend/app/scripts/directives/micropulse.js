// directives/micropulse.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function PulsarMicropulseDirective () {
  return {
    templateUrl: 'views/directives/micropulse.html',
    restrict: 'E',
    link: function postLink (/*scope, element, attrs*/) {
      // TODO instantiate CKEDITOR.inline around editable pulses allowing for
      // in-place edits of micropulses owned by the current user
    }
  };
}

PulsarMicropulseDirective.$inject = [

];

angular.module('pulsarClientApp')
.directive('pulsarMicropulse', PulsarMicropulseDirective);
