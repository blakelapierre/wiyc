// controllers/footer.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';
/* global $:false */

function FooterCtrl ($scope, UserSession, PulseWire) {
  var self = this;

  self.$scope = $scope;
  self.PulseWire = PulseWire;

  $scope.user = UserSession;
  $scope.onlineStatus = 'ONLINE';

  $scope.clickSettings = function ( ) {
    if (!$scope.user.session.authenticated) {
      $('#userLoginModal').modal('show');
      return;
    }
  };

  $scope.clickFriends = function ( ) {
    if (!$scope.user.session.authenticated) {
      $('#userLoginModal').modal('show');
      return;
    }
  };

  $scope.clickInbox = function ( ) {
    if (!$scope.user.session.authenticated) {
      $('#userLoginModal').modal('show');
      return;
    }
  };
}

FooterCtrl.$inject = [
  '$scope',
  'UserSession',
  'PulseWire'
];

angular.module('robcolbertApp')
.controller('FooterCtrl', FooterCtrl);
