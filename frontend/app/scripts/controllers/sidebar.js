// controllers/sidebar.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function SidebarCtrl ($scope, UserSession) {

  $scope.session = UserSession.session;
  $scope.className = '';

}

SidebarCtrl.$inject = [
  '$scope',
  'UserSession'
];

angular.module('pulsarClientApp')
.controller('SidebarCtrl', SidebarCtrl);
