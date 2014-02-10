// controllers/contact.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

angular.module('robcolbertApp')
.controller('ContactCtrl', [
  '$scope',
  function ($scope) {
    $scope.$emit('setPageGroup', 'contact');
  }
]);
