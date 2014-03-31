// controllers/account-login.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

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
