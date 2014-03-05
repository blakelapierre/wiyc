// services/user-session.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

function UserSession($rootScope, $location, Sessions) {

  var self = this;

  //
  // constants
  //
  self.WITH_REDIRECT = true;

  self.$rootScope = $rootScope;

  var defaultSession = { 'authenticated': { 'status': false } };
  self.session = defaultSession;

  self.$rootScope.$on('setUserSession', function (event, userSession) {
    console.log('new user session', userSession);
    self.session = userSession;
    if (!angular.isDefined(self.session.authenticated)) {
      self.session.authenticated = { 'status': false };
    }
  });

  self.$rootScope.$on('clearUserSession', function (/* event */) {
    console.log('clearing user session');
    self.session = defaultSession;
  });

  self.checkAuthentication = function (withRedirect) {
    if (self.session.authenticated.status) {
      return true; // all good
    }

    // user is not currently authenticated.
    if (withRedirect) {
      // bounce to home page
      $location.path('/');
    }

    // let the caller know this one's not alright.
    return false;
  };

  self.logout = function ( ) {
    Sessions.delete(function ( ) {
      $rootScope.$broadcast('clearUserSession');
    });
  };

  Sessions.get(function (session) {
    $rootScope.$broadcast('setUserSession', session);
  });
}

//
// AngularJS dependency injection
//

UserSession.$inject = [
  '$rootScope',
  '$location',
  'Sessions'
];

//
// AngularJS service module registration
//

angular.module('robcolbertApp')
.service('UserSession', UserSession);
