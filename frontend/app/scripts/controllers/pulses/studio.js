// controllers/pulses/studio.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function PulsarStudioCtrl ($scope) {
  $scope.awesomeThings = [
    'HTML5 Boilerplate',
    'AngularJS',
    'Karma'
  ];
}

PulsarStudioCtrl.$inject = [
  '$scope'
];

angular.module('robcolbertApp')
.controller('PulsarStudioCtrl', PulsarStudioCtrl);
