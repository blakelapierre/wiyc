/*
 * FILE
 *  controllers/pulses.js
 *
 * PURPOSE
 *
 *
 * LICENSE
 *  Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to
 *  deal in the Software without restriction, including without limitation the
 *  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 *  sell copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 *  IN THE SOFTWARE.
 */

'use strict';
/* global twttr:false */
/* global moment:false */

function PulsesCtrl ($scope, $route, $window, Pulses) {
  $window.scrollTo(0, 0);

  $scope.$emit('setPageGroup', 'blog');
  ga('send', 'pageview');

  $scope.currentPage = parseInt($route.current.params.p) || 1;
  $scope.pulsesPerPage = parseInt($route.current.params.cpp) || 10;

  $scope.pulses = Pulses.list(
    {
      'p': $scope.currentPage,
      'cpp':$scope.pulsesPerPage
    },
    function ( ) {
      var idx, maxPages = $scope.pulses.count / $scope.pulsesPerPage;

      console.log('pulses have arrived', $scope.pulses);
      setTimeout(twttr.widgets.load, 0);

      $scope.pages = [ ];
      for (idx = $scope.currentPage - 3; idx <= maxPages; ++idx) {
        if (idx >= 1) {
          $scope.pages.push(idx);
        }
      }
      ga('send','event', 'Pulses', 'listed', $scope.pulses.length);
    }
  );

  $scope.calendarMoment = function (date) { return moment(date).calendar(); };
  $scope.fromNow = function (date) { return moment(date).fromNow(); };

}

PulsesCtrl.$inject = [
  '$scope',
  '$route',
  '$window',
  'Pulses'
];

angular.module('robcolbertApp')
.controller('PulsesCtrl', PulsesCtrl);
