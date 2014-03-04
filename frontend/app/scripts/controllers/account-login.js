// controllers/account-login.js
// Copyright (C) 2014 <rob.isConnected@gmail.com>

'use strict';
/* global $: false */

function AccountLoginCtrl ($scope, $window, Sessions) {
  $scope.email = '';
  $scope.password = '';

  $scope.haveError = false;
  $scope.error = null;
  $scope.dismissError = function ( ) {
    $scope.haveError = false;
    $scope.error = null;
  };

  $scope.userLogin = function ( ) {
    Sessions.create(
      {
        'email': $scope.email,
        'password': $scope.password
      },
      function onSessionCreateSuccess (session) {
        $scope.$emit('setUserSession', session);
        $('#userLoginModal').modal('hide');
      },
      function onSessionCreateError (error) {
        console.log('Sessions.create error', error);
        $scope.haveError = true;
        $scope.error = error;
        $scope.$emit('clearUserSession');
      }
    );
  };
}

AccountLoginCtrl.$inject = [
  '$scope',
  '$window',
  'Sessions'
];

angular.module('robcolbertApp')
.controller('AccountLoginCtrl', AccountLoginCtrl);
