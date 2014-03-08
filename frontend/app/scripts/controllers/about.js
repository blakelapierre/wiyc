// controllers/about.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

function AboutCtrl ($scope, $window) {
  $window.scrollTo(0, 0);
  $scope.$emit('setPageGroup', 'about');
  ga('send', 'pageview');
}

AboutCtrl.$inject = [
  '$scope',
  '$window'
];

angular.module('robcolbertApp')
.controller('AboutCtrl', AboutCtrl);
