// directives/pulse-summary.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function PulsarPulseSummaryDirective ( ) {
  return {
    templateUrl: 'views/directives/pulse-summary.html',
    restrict: 'E',
    link: function postLink (/*scope, element, attrs*/) {
      // TODO instantiate CKEDITOR.inline around editable pulses allowing for
      // in-place edits of micropulses owned by the current user
    }
  };
}

PulsarPulseSummaryDirective.$inject = [

];

angular.module('pulsarClientApp')
.directive('pulsarPulseSummary', PulsarPulseSummaryDirective);
