// controllers/pulses/pulseId/edit.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function PulseEditCtrl (
  $rootScope,
  $scope,
  $route,
  $location,
  $sce,
  $timeout,
  Configuration,
  UserSession,
  Pulses
) {

  $scope.session = UserSession.session;
  ga('send','pageview');

  $scope.$emit('setPageGroup', 'blog');

  $scope.ckeditorOptionsExcerpt = Configuration.ckeditorOptions.small;
  $scope.ckeditorOptionsContent = Configuration.ckeditorOptions.full;

  $scope.pulseContent = '';
  $scope.haveError = false;
  $scope.error = '';

  Pulses.get({'pulseId': $route.current.params.pulseId}, null, function (pulse) {
    if (!$scope.session.authenticated.status || (pulse._creator._id !== $scope.session.user._id)) {
      $location.path('/');  // send them home; and
      return;               // refuse to provide an editable interface for the pulse data.
    }
    $scope.pulse = pulse;
    if (angular.isDefined(window.twttr)) {
      //setTimeout(window.twttr.widgets.load, 0);
      window.twttr.widgets.load();
    }
  });

  $scope.calendarMoment = function (date) { return moment(date).calendar(); };
  $scope.fromNow = function (date) { return moment(date).fromNow(); };

  $scope.updatePulse = function ( ) {
    if (!$scope.session.authenticated.status) {
      return;
    }
    $scope.pulse.$update(
      {'pulseId':$scope.pulse._id},
      function onPulseUpdateSuccess ( ) {
        ga('send','event', 'Pulses', 'updateSuccess', 1);
        $location.path('/pulses/'+$scope.pulse._id);
      },
      function onPulseUpdateError (error) {
        ga('send','event', 'Pulses', 'updateError', 1);
        $scope.error = error;
        $scope.haveError = true;
      }
    );
  };
}

PulseEditCtrl.$inject = [
  '$rootScope',
  '$scope',
  '$route',
  '$location',
  '$sce',
  '$timeout',
  'Configuration',
  'UserSession',
  'Pulses'
];

angular.module('robcolbertApp')
.controller('PulseEditCtrl', PulseEditCtrl);
