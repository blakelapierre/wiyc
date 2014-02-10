// controllers/header.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';
/* global $:false */

angular.module('robcolbertApp')
.controller('HeaderCtrl', [
  '$scope',
  '$rootScope',
  function ($scope, $rootScope) {
    $scope.title = 'robcolbert.com';
    $scope.subtitle = 'simplicity as a science';

    $scope.pills = {
      'blog': {
        'className': 'active'
      },
      'about': {
        'className': ''
      },
      'contact': {
        'className': ''
      }
    };

    $rootScope.$on('setPageGroup', function onPageGroupChanged (event, group) {
      $.each($scope.pills, function (index, pill) {
        pill.className = '';
      });
      switch (group) {
        case 'blog':
          $scope.pills.blog.className = 'active';
          break;
        case 'about':
          $scope.pills.about.className = 'active';
          break;
        case 'contact':
          $scope.pills.contact.className = 'active';
          break;
      }
    });

  }
]);
