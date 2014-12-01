// directives/service-error.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function PulsarServiceErrorDirective ($rootScope, $timeout) {
  return {
    'templateUrl': 'views/directives/service-error.html', //<< It's themeable
    'restrict': 'E', //<< Allow use only as element
    'link': function postLink(scope, element, attrs) {
      var autoclose = attrs.autoclose || false;
      var autocloseDelay = attrs.autocloseDelay || 10;
      var drawer = element.find('.pulsar-drawer');

      scope.errors = [ ]; // container to hold information about errors

      scope.closeError = function (record) {
        var idx = scope.errors.indexOf(record);
        if (idx === -1) {
          return;
        }
        scope.errors.splice(idx, 1).forEach(function (removedRecord) {
          if (removedRecord.timeoutPromise) {
            $timeout.cancel(removedRecord.timeoutPromise);
            removedRecord.timeoutPromise = null;
          }
        });
        if (scope.errors.length === 0) {
          drawer.removeClass('visible');
        }
      };

      scope.closeAllErrors = function ( ) {
        scope.errors = [ ];
        drawer.removeClass('visible');
      };

      $rootScope.$on('pulsarServiceError', function (event, error) {
        drawer.addClass('visible');
        var errorRecord = {
          'created': moment().format('dddd [at] h:mm:ss a'),
          'timeoutPromise': null,
          'error': error
        };
        if (autoclose) {
          errorRecord.timeoutPromise = $timeout(
            function ( ) {
              scope.errors.pop();
            },
            autocloseDelay
          );
        }
        scope.errors.unshift(errorRecord);
      });
    }
  };
}

PulsarServiceErrorDirective.$inject = [
  '$rootScope',
  '$timeout'
];

angular.module('wiyc')
.directive('pulsarServiceError', PulsarServiceErrorDirective);
