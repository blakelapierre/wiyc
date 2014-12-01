// services/user-session.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function UserSession($rootScope, $location, Sessions) {

  var self = this;

  //
  // constants
  //
  self.WITH_REDIRECT = true;

  self.$rootScope = $rootScope;

  self.defaultSession = { 'authenticated': { 'status': false } };
  self.session = self.defaultSession;
  self.haveError = false;
  self.error = null;

  self.$rootScope.$on('setUserSession', function (event, userSession) {
    self.session = userSession;
    if (!angular.isDefined(self.session.authenticated)) {
      self.session.authenticated = { 'status': false };
    }
  });

  self.$rootScope.$on('clearUserSession', function (/* event */) {
    console.log('clearing user session');
    self.session = self.defaultSession;
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

  self.login = function (parameters) {
    var successHandler = function ( ) { };
    var errorHandler = function ( ) { };
    var thenHandler = function ( ) { };

    Sessions.create(
      parameters,
      function onSessionCreateSuccess (session) {
        ga('send','event','Authentication','userLoginSuccess',1);
        $rootScope.$broadcast('setUserSession', session);
        successHandler(session);
      },
      function onSessionCreateError (error) {
        console.log('Sessions.create error', error);
        ga('send','event','Authentication','userLoginError', 1);
        errorHandler(error);
      }
    );

    var promise = {
      'success': function setSuccessHandler (handler) {
        successHandler = handler;
        return promise;
      },
      'error': function setErrorHandler (handler) {
        errorHandler = handler;
        return promise;
      },
      'then': function setThenHandler (handler) {
        thenHandler = handler;
        return promise;
      }
    };

    return promise;
  };

  self.logout = function ( ) {
    ga('send', 'event', 'Authentication', 'logout', 1);
    Sessions.delete(function ( ) {
      $rootScope.$broadcast('clearUserSession');
    });
  };

  ga('send', 'event', 'Authentication', 'fetchSession', 1);
  Sessions.get(
    function onSessionGetSuccess (session) {
      ga('send', 'event', 'Authentication', 'fetchSessionSuccess', 1);
      $rootScope.$broadcast('setUserSession', session);
    },
    function onSessionsGetError (error) {
      $rootScope.$broadcast('pulsarMaintenanceMode');
      $location.path('/maintenance-mode');
      ga('send', 'event', 'Authentication', 'sessionGetError', 1);
      self.haveError = true;
      self.error = error;
    }
  );
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

angular.module('wiyc')
.service('UserSession', UserSession);
