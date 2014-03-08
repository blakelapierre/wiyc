// controllers/header.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';
/* global $:false */

function HeaderCtrl ($scope, $rootScope, UserSession, PulseWire) {

  $scope.pulsewire = PulseWire;
  $scope.title = 'robcolbert.com';
  $scope.brand = 'PULSAR';
  $scope.subtitle = 'simplicity as a science';

  $scope.session = UserSession.session;
  $rootScope.$on('setUserSession', function (event, session) {
    $scope.session = session;
    ga('send', 'event', 'Authentication', 'setUserSession', 1);
  });
  $rootScope.$on('clearUserSession', function ( ) {
    $scope.session = null;
    ga('send', 'event', 'Authentication', 'clearUserSession', 1);
  });

  $scope.pills = {
    'main': {
      'className': ''
    },
    'blog': {
      'className': 'active'
    },
    'postComposer': {
      'className': ''
    },
    'videos': {
      'className': ''
    },
    'prototype': {
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
    ga('send', 'event', 'Authentication', 'showLoginModal', 1);
    $('#userLoginModal').modal('show');
  };

  $scope.clearUserSession = function ( ) {
    UserSession.logout(function ( ) {
      $scope.$emit('clearUserSession');
    });
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
