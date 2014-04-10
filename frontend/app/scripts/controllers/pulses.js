// controllers/pulses.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function PulsesCtrl ($scope, $route, $location, $window, Pulses) {
  $window.scrollTo(0, 0);
  ga('send', 'pageview');

  $scope.$emit('setPageGroup', 'blog');
  $scope.$emit('setPageInformation', {
    'title': 'All Pulses'
  });

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
      if (angular.isDefined(window.twttr)) {
        setTimeout(window.twttr.widgets.load, 0);
      }

      $scope.pages = [ ];
      for (idx = $scope.currentPage - 3; idx <= maxPages; ++idx) {
        if (idx >= 1) {
          $scope.pages.push(idx);
        }
      }
      ga('send','event', 'Pulses', 'listed', $scope.pulses.length);
    }
  );

  var moment = $window.moment;
  $scope.calendarMoment = function (date) { return moment(date).calendar(); };
  $scope.fromNow = function (date) { return moment(date).fromNow(); };

  $scope.loadPulse = function (pulseId) {
    console.log('loading pulse', pulseId.toString());
    $location.path('/pulses/'+pulseId.toString());
  };

}

PulsesCtrl.$inject = [
  '$scope',
  '$route',
  '$location',
  '$window',
  'Pulses'
];

angular.module('pulsarClientApp')
.controller('PulsesCtrl', PulsesCtrl);
