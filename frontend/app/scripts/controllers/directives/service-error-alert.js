// controllers/error-alert.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function ServiceErrorAlertCtrl ($scope, $rootScope) {

  $scope.haveError = false;
  $scope.error = null;

  $rootScope.$on('setServiceError', function (event, error) {
    $scope.haveError = true;
    $scope.error = error;
  });

}

ServiceErrorAlertCtrl.$inject = [
  '$scope',
  '$rootScope'
];

angular.module('pulsarClientApp')
.controller('ServiceErrorAlertCtrl', ServiceErrorAlertCtrl);
