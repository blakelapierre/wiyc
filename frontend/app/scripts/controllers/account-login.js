// controllers/account-login.js
// Copyright (C) 2014 <rob.isConnected@gmail.com>

'use strict';
/* global $: false */

function AccountLoginCtrl ($scope) {
  $scope.email = '';
  $scope.password = '';

  $scope.userLogin = function ( ) {
    var session = {
      'authenticated': true,
      'username': 'rcolbert',
      'displayName': 'Rob'
    };
    $scope.$emit('setUserSession', session);
    $('#userLoginModal').modal('hide');
  };

}

AccountLoginCtrl.$inject = [
  '$scope'
];

angular.module('robcolbertApp')
.controller('AccountLoginCtrl', AccountLoginCtrl);
