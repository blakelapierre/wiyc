// directives/micropulse.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function PulsarMicropulseDirective ( ) {
  return {
    'templateUrl': 'views/directives/micropulse.html',
    'restrict': 'E'
  };
}

PulsarMicropulseDirective.$inject = [

];

angular.module('pulsarClientApp')
.directive('pulsarMicropulse', PulsarMicropulseDirective);
