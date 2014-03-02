// controllers/header.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';
/* global $:false */

function HeaderCtrl ($scope, $rootScope, UserSession, PulseWire) {

  $scope.pulsewire = PulseWire;
  $scope.title = 'robcolbert.com';
  $scope.brand = 'PULSAR';
  $scope.subtitle = 'simplicity as a science';

  $scope.user = UserSession;

  $scope.pills = {
    'blog': {
      'className': 'active'
    },
    'postComposer': {
      'className': ''
    },
    'videos': {
      'className': ''
    },
    'about': {
      'className': ''
    },
    'contact': {
      'className': ''
    },
    'hireRob': {
      'className': ''
    }
  };

  $rootScope.$on('setPageGroup', function onPageGroupChanged (event, group) {
    $.each($scope.pills, function (index, pill) {
      pill.className = '';
    });
    $scope.pills[group].className = 'active';
  });

  $scope.showLoginModal = function ( ) {
    $('#userLoginModal').modal('show');
  };

  $scope.clearUserSession = function ( ) {
    $scope.$emit('clearUserSession');
  };

}

HeaderCtrl.$inject = [
  '$scope',
  '$rootScope',
  'UserSession',
  'PulseWire'
];

angular.module('robcolbertApp')
.controller('HeaderCtrl', HeaderCtrl);
