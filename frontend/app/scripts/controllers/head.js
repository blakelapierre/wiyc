// controllers/head.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function HeadCtrl ($rootScope, $scope) {

  $scope.pageInformation = {
    'title': 'Loading...',
    'attribution': { }
  };

  $rootScope.$on('setPageInformation', function (event, pageInformation) {
    $scope.pageInformation = pageInformation;
  });

}

HeadCtrl.$inject = [
  '$rootScope',
  '$scope'
];

angular.module('wiyc')
.controller('HeadCtrl', HeadCtrl);
