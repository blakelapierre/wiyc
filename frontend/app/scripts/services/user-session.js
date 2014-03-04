// services/user-session.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

function UserSession($rootScope, Sessions) {

  var self = this;

  self.$rootScope = $rootScope;

  var defaultSession = { 'authenticated': { 'status': false } };
  self.session = defaultSession;

  self.$rootScope.$on('setUserSession', function (event, userSession) {
    console.log('new user session', userSession);
    self.session = userSession;
  });

  self.$rootScope.$on('clearUserSession', function (/* event */) {
    console.log('clearing user session');
    self.session = defaultSession;
  });

  self.logout = function ( ) {
    Sessions.delete(function ( ) {
      $rootScope.$broadcast('clearUserSession');
    });
  };

  Sessions.get(function (session) {
    $rootScope.$broadcast('setUserSession', session);
  });
}

UserSession.$inject = [
  '$rootScope',
  'Sessions'
];

angular.module('robcolbertApp')
.service('UserSession', UserSession);
