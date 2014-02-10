// controllers/about.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

angular.module('robcolbertApp')
.controller('AboutCtrl', [
  '$scope',
  function ($scope) {
    $scope.$emit('setPageGroup', 'about');
  }
]);
