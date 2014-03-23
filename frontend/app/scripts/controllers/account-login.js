/*
 * FILE
 *  controllers/account-login.js
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
/* global $: false */

function AccountLoginCtrl ($scope, $rootScope, $window, Sessions) {
  $scope.email = '';
  $scope.password = '';

  $scope.haveError = false;
  $scope.error = null;
  $scope.dismissError = function ( ) {
    $scope.haveError = false;
    $scope.error = null;
  };

  $scope.userLogin = function ( ) {
    ga('send','event','Authentication','userLogin', 1);
    Sessions.create(
      {
        'email': $scope.email,
        'password': $scope.password
      },
      function onSessionCreateSuccess (session) {
        ga('send','event','Authentication','userLoginSuccess',1);
        $rootScope.$broadcast('setUserSession', session);
        $('#userLoginModal').modal('hide');
      },
      function onSessionCreateError (error) {
        console.log('Sessions.create error', error);
        ga('send','event','Authentication','userLoginError', 1);
        $scope.haveError = true;
        $scope.error = error;
        $scope.$emit('clearUserSession');
      }
    );
  };
}

AccountLoginCtrl.$inject = [
  '$scope',
  '$rootScope',
  '$window',
  'Sessions'
];

angular.module('robcolbertApp')
.controller('AccountLoginCtrl', AccountLoginCtrl);
