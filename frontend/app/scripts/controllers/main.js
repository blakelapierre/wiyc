// controllers/main.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function MainCtrl ($scope, $rootScope, $window, UserSession, Pulses) {
  $window.scrollTo(0, 0);
  ga('send', 'pageview');

  $scope.session = UserSession.session;
  if (!$scope.session.authenticated.status) {
    $scope.$emit('setPageInformation', { 'title': 'Welcome to Pulsar' });
  } else {
    $scope.$emit('setPageInformation', {
      'title': 'Pulsar Home for ' + UserSession.session.user.displayName,
      'attribution': UserSession.user
    });
  }

  $scope.$emit('setPageGroup', 'main');

  $scope.$on('setUserSession', function ( ) {
    $scope.$emit('setPageInformation', {
      'title': 'Pulsar Home for ' + UserSession.session.user.displayName,
      'attribution': UserSession.session
    });
  });

  $scope.pulses = Pulses.list();

  $rootScope.$broadcast('showAnnouncement', {
    'title':'Hello Early Adopters',
    'content':'New user signup and public blogging are live! Hit the "Let Me Publish!" button to get started, and welcome to Pulsar!',
    'displayTime': '10000'
  });
}

MainCtrl.$inject = [
  '$scope',
  '$rootScope',
  '$window',
  'UserSession',
  'Pulses'
];

angular.module('pulsarClientApp')
.controller('MainCtrl', MainCtrl);
