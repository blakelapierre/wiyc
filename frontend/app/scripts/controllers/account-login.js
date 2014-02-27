// controllers/account-login.js
// Copyright (C) 2014 <rob.isConnected@gmail.com>

'use strict';
/* global $: false */

function AccountLoginCtrl ($scope, $window) {

  $scope.email = '';
  $scope.password = '';

  $scope.userLogin = function ( ) {
    if ($scope.password !== 'ionfrali') {
      $('#userLoginModal').modal('hide');
      $window.alert('wrong');
      return;
    }
    var session = {
      'authenticated': true,
      'username': 'rcolbert',
      'displayName': 'Rob',
      'inbox': { 'count': 8 },
      'friends': { 'onlineCount': 2 }
    };
    $scope.$emit('setUserSession', session);
    $('#userLoginModal').modal('hide');
  };
}

AccountLoginCtrl.$inject = [
  '$scope',
  '$window'
];

angular.module('robcolbertApp')
.controller('AccountLoginCtrl', AccountLoginCtrl);
