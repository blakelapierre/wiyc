// controllers/about.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function AboutCtrl ($scope, $window, PresentationEngine) {
  PresentationEngine.setQuakeMagnitude(1.6);
  $window.scrollTo(0, 0);
  $scope.$emit('setPageGroup', 'about');
  ga('send', 'pageview');
}

AboutCtrl.$inject = [
  '$scope',
  '$window',
  'PresentationEngine'
];

angular.module('pulsarClientApp')
.controller('AboutCtrl', AboutCtrl);
