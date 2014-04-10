// directives/service-error.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function PulsarServiceErrorDirective ( ) {
  return {
    templateUrl: 'views/directives/service-error.html',
    restrict: 'EA'
  };
}

PulsarServiceErrorDirective.$inject = [

];

angular.module('pulsarClientApp')
.directive('pulsarServiceError', PulsarServiceErrorDirective);
