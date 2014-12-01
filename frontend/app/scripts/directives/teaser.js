// controllers/teaser.js
// Copyright (C) Blake La Pierre <blakelapierre@gmail.com>
// License: MIT

'use strict';

function TeaserCtrl ($interval) {
  return {
    'templateUrl': 'views/directives/teaser.html',
    'restrict': 'E',
    'link': function (scope, element/*, attrs*/) {

      if (true) {
        element.remove();
      }
      else {
        $interval(function() {
          element.remove();
        }, 5000);
      }
    }
  };
}

TeaserCtrl.$inject = [
  '$interval'
];

angular.module('wiyc')
.directive('teaser', TeaserCtrl);
