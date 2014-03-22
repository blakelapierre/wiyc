/*
 * FILE
 *  services/user-session.js
 *
 * PURPOSE
 *
 * 
 * LICENSE
 *  Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to
 *  deal in the Software without restriction, including without limitation the
 *  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 *  sell copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 *  IN THE SOFTWARE.
 */

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
    ga('send', 'event', 'Authentication', 'logout', 1);
    Sessions.delete(function ( ) {
      $rootScope.$broadcast('clearUserSession');
    });
  };

  ga('send', 'event', 'Authentication', 'fetchSession', 1);
  Sessions.get(
    function onSessionGetSuccess (session) {
      console.log('user session created');
      ga('send', 'event', 'Authentication', 'fetchSessionSuccess', 1);
      $rootScope.$broadcast('setUserSession', session);
    },
    function onSessionsGetError (error) {
      console.log('user session create/fetch failed', error);
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

angular.module('robcolbertApp')
.service('UserSession', UserSession);
