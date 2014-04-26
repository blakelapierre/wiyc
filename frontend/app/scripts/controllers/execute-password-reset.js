// execute-password-reset.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function ExecutePasswordResetCtrl ($scope, $route, $window, Users) {
  $window.scrollTo(0, 0);
  $scope.state = 'input';
  $scope.request = {
    'token': $route.current.params.token,
    'email': $route.current.params.email
  };

  $scope.executePasswordReset = function ( ) {
    Users.executePasswordReset(
      $scope.request,
      function onSetNewPasswordSuccess (user) {
        console.log('setNewPassword', user);
        $scope.state = 'success';
        $window.scrollTo(0, 0);
      },
      function onSetNewPasswordError (error) {
        console.error('setNewPassword', error);
        $scope.$emit('setServiceError', error);
        $scope.state = 'error';
        $window.scrollTo(0, 0);
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
.controller('ExecutePasswordResetCtrl', ExecutePasswordResetCtrl);
