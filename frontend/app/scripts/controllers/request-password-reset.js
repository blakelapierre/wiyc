// controllers/request-password-reset.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function RequestPasswordResetCtrl ($scope, $window, Users) {
  $window.scrollTo(0, 0);
  $scope.state = 'input';
  $scope.request = { };

  $scope.requestPasswordReset = function ( ) {
    $scope.state = 'processing';
    Users.requestPasswordReset(
      $scope.request,
      function onRequestPasswordResetSuccess ( ) {
        $scope.state = 'success';
        $window.scrollTo(0, 0);
      },
      function onRequestPasswordResetError (error) {
        console.error('request-password-reset', error);
        $scope.$emit('setServiceError', error);
        $window.scrollTo(0, 0);
      }
    );
  };
}

RequestPasswordResetCtrl.$inject = [
  '$scope',
  '$window',
  'Users'
];

angular.module('pulsarClientApp')
.controller('RequestPasswordResetCtrl', RequestPasswordResetCtrl);
