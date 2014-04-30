'use strict';

angular.module('pulsarClientApp')
  .directive('pulsarBottomMenu', function () {
    return {
      templateUrl: 'views/directives/bottom-menu.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        // element.text('this is the pulsarBottomMenu directive');
      }
    };
  });
