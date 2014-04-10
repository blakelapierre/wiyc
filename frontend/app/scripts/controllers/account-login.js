// controllers/account-login.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';
/* global $: false */

function AccountLoginCtrl ($scope, $rootScope, $window, UserSession) {
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

    UserSession
    .login({ 'email': $scope.email, 'password': $scope.password })
    .success(function (session) {
      console.log('account-login success', session);
      $('#userLoginModal').modal('hide');
    })
    .error(function (error) {
      console.log('account-login error', error);
      $scope.haveError = true;
      $scope.error = error;
      $scope.$emit('clearUserSession');
    });
  };
}

AccountLoginCtrl.$inject = [
  '$scope',
  '$rootScope',
  '$window',
  'UserSession'
];

angular.module('pulsarClientApp')
.controller('AccountLoginCtrl', AccountLoginCtrl);
