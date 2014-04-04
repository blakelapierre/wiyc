// controllers/pulses/compose.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function PulsarComposerCtrl ($scope, $rootScope, $location, $window, Configuration, UserSession, Pulses) {
  $window.scrollTo(0, 0);

  $scope.$emit('setPageGroup', 'blog');
  $scope.haveError = false;
  $scope.errorMessage = '';

  $rootScope.$on('clearUserSession', function ( ) {
    $location.path('/');
  });

  $scope.editable = true;
  $scope.ckeditorOptionsExcerpt = Configuration.ckeditorOptions.small;
  $scope.ckeditorOptionsContent = Configuration.ckeditorOptions.full;

  $scope.user = UserSession.session.user;
  console.log('COMPOSER USER SESSION', $scope.user);
  $scope.pulse = { };

  $scope.calendarMoment = function (date) { return moment(date).calendar(); };
  $scope.fromNow = function (date) { return moment(date).fromNow(); };

  $scope.createPulse = function ( ) {
    Pulses.create(
      $scope.pulse,
      function onCreatePulseSuccess (newPulse) {
        console.log('pulse created', newPulse);
        ga('send','event', 'Pulses', 'createSuccess', 1);
        $location.path('/pulses/' + newPulse._id);
      },
      function onCreatePulseError (error) {
        console.log('pulses.create error', error);
        ga('send','event', 'Pulses', 'createError', 1);
        $scope.haveError = true;
        $scope.error = error;
      }
    );
  };

  $scope.refreshWidgets = function ( ) {
    twttr.widgets.load();
  };
}

PulsarComposerCtrl.$inject = [
  '$scope',
  '$rootScope',
  '$location',
  '$window',
  'Configuration',
  'UserSession',
  'Pulses'
];

angular.module('robcolbertApp')
.controller('PulsarComposerCtrl', PulsarComposerCtrl);
