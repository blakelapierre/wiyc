// password-reset.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function PasswordResetCtrl ($scope, $route, Users) {
  $scope.request = {
    'token': $route.current.params.token,
    'email': $route.current.params.email
  };

  $scope.executePasswordReset = function ( ) {
    Users.executePasswordReset(
      $scope.request,
      function onSetNewPasswordSuccess (user) {
        console.log('setNewPassword', user);
      },
      function onSetNewPasswordError (error) {
        console.error('setNewPassword', error);
        $scope.$emit('setServiceError', error);
      }
    );
  };
}

PasswordResetCtrl.$inject = [
  '$scope',
  '$route',
  'Users'
];

angular.module('pulsarClientApp')
.controller('PasswordResetCtrl', PasswordResetCtrl);
