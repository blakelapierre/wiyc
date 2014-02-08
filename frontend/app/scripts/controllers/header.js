// controllers/header.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

angular.module('robcolbertApp')
.controller('HeaderCtrl', function ($scope) {
  $scope.title = 'robcolbert.com';
  $scope.subtitle = 'simplicity as a science';
});
