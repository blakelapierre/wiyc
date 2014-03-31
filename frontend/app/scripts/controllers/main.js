// controllers/main.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function MainCtrl ($scope, $rootScope, $window, UserSession, Pulses) {
  $window.scrollTo(0, 0);
  $scope.session = UserSession.session;
  console.log('USER', $scope.user);
  $scope.$emit('setPageGroup', 'main');
  ga('send', 'pageview');

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

angular.module('robcolbertApp')
.controller('MainCtrl', MainCtrl);
