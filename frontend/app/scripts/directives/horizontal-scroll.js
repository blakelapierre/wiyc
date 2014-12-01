// directives/horizontal-scroll.js
// Copyright (C) Blake La Pierre <blakelapierre@gmail.com>
// License: MIT

'use strict';

function HorizontalScroll () {
  return {
    'restrict': 'A',
    'link': function (scope, element/*, attrs*/) {
      element.on('mousewheel', function(e) {
        var wheel = e.originalEvent;

        element[0].scrollLeft = Math.max(0, element[0].scrollLeft + wheel.wheelDelta);
      });
    }
  };
}

HorizontalScroll.$inject = [];

angular.module('wiyc')
.directive('horizontalScroll', HorizontalScroll);
