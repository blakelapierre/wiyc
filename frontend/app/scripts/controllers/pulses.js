// controllers/pulses.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';
/* global moment:false */

function PulsesCtrl ($scope, $rootScope, $sce, UserSession, Pulses) {

  $scope.user = UserSession;

  Pulses.list(function (pulses) {
    ga('send','event', 'Pulses', 'listed', pulses.length);
    pulses.forEach(function (pulse) {
      pulse.content = $sce.trustAsHtml(pulse.content);
    });
    console.log('pulses', pulses);
    $scope.pulses = pulses;
    if (angular.isDefined(window.twttr)) {
      setTimeout(window.twttr.widgets.load, 0);
    }
  });

  $rootScope.$on('clearUserSession', function ( ) {
    $scope.showComposer = false;
    $scope.newPulse = { };
  });

  $scope.dateAsMoment = function (date) { return moment(date).calendar(); };

  $scope.newPulse = { };
  $scope.createPulse = function ( ) {
    if (!$scope.user.session.authenticated.status) {
      // Not authenticated, don't even know how you got here, but...no.
      // But, relax. This is only a best effort. The back end isn't going
      // to accept the pulse even if submitted via curl, though.
      return;
    }
    Pulses.create($scope.newPulse, function (pulse) {
      ga('send','event', 'Pulses', 'created', 1);
      $scope.pulses.unshift(pulse);
      $scope.showComposer = false;
      $scope.newPulse = { };
      if (angular.isDefined(window.twttr)) {
        setTimeout(window.twttr.widgets.load, 0);
      }
    });
  };

}

PulsesCtrl.$inject = [
  '$scope',
  '$rootScope',
  '$sce',
  'UserSession',
  'Pulses'
];

angular.module('robcolbertApp')
.controller('PulsesCtrl', PulsesCtrl);
