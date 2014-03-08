// controllers/footer.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';
/* global $:false */

function FooterCtrl ($scope, $interval, Configuration, UserSession, PulseWire) {
  var self = this;

  self.$interval = $interval;
  self.PulseWire = PulseWire;

  self.$scope = $scope;

  $scope.session = UserSession.session;
  $scope.$on('setUserSession', function (event, session) {
    $scope.session = session;
  });
  $scope.$on('clearUserSession', function ( ) {
    $scope.session = null;
  });

  self.messageAdvanceInterval = null;
  $scope.messages = [ ];
  $scope.message = null;

  self.pushMessage({
    'created': new Date(),
    'content':'Welcome to Pulsar 0.1.0.'
  });
  self.pushMessage({
    'created': new Date(),
    'content':'It\'s been a genuine pleasure creating this for you.'
  });
  self.pushMessage({
    'created': new Date(),
    'content':'If you like Pulsar, consider becoming an early adopter!'
  });
  self.pushMessage({
    'created': new Date(),
    'content':'And, keep your eye here. This area has a purpose ;)'
  });

  $scope.clickSettings = function ( ) {
    ga('send', 'event', 'Footer', 'clickSettings', 1);
    if (!$scope.user.session.authenticated.status) {
      $('#userLoginModal').modal('show');
      return;
    }
  };

  $scope.clickFriends = function ( ) {
    ga('send', 'event', 'Footer', 'clickFriends', 1);
    if (!$scope.user.session.authenticated.status) {
      $('#userLoginModal').modal('show');
      return;
    }
  };

  $scope.clickInbox = function ( ) {
    ga('send', 'event', 'Footer', 'clickInbox', 1);
    if (!$scope.user.session.authenticated.status) {
      $('#userLoginModal').modal('show');
      return;
    }
  };
}

FooterCtrl.prototype.pushMessage = function (message) {
  var self = this;
  var $scope = self.$scope;
  var $interval = self.$interval;

  $scope.messages.push(message);
  if (self.messageAdvanceInterval === null) {
    self.messageAdvanceInterval = $interval(function ( ) {
      self.advanceMessage();
    }, 2500);
  }
};

FooterCtrl.prototype.advanceMessage = function ( ) {
  var self = this;
  var $scope = self.$scope;
  var $interval = self.$interval;

  if (($scope.messages.length === 0) && (self.messageAdvanceInterval !== null)) {
    $interval.cancel(self.messageAdvanceInterval);
    self.messageAdvanceInterval = null;
    $scope.message = null;
    return;
  }

  $scope.message = $scope.messages.shift();
};

FooterCtrl.$inject = [
  '$scope',
  '$interval',
  'Configuration',
  'UserSession',
  'PulseWire'
];

angular.module('robcolbertApp')
.controller('FooterCtrl', FooterCtrl);
