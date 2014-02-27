// controllers/hire-rob.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

function HireRobCtrl ($scope, $window) {
  $window.scrollTo(0, 0);
  $scope.$emit('setPageGroup', 'hireRob');
}

HireRobCtrl.$inject = [
  '$scope',
  '$window'
];

angular.module('robcolbertApp')
.controller('HireRobCtrl', HireRobCtrl);
