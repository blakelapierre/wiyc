// controllers/sidebar.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

function SidebarCtrl ($scope) {

  $scope.className = '';

}

SidebarCtrl.$inject = [
  '$scope'
];

angular.module('robcolbertApp')
.controller('SidebarCtrl', SidebarCtrl);
