// controllers/head.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function HeadCtrl ($rootScope, $scope, SiteSettings) {

  $scope.pageInformation = {
    'title': 'Loading...',
    'attribution': { }
  };

  $rootScope.$on('setPageInformation', function (event, pageInformation) {
    $scope.pageInformation = pageInformation;
  });

  $scope.site = SiteSettings.get(function ( ) {
    //console.log('site settings', $scope.site);
  });

}

HeadCtrl.$inject = [
  '$rootScope',
  '$scope',
  'SiteSettings'
];

angular.module('pulsarClientApp')
.controller('HeadCtrl', HeadCtrl);
