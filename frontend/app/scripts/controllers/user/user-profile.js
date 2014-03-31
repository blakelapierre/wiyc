// controllers/user/user-profile.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function UserUseridCtrl ($scope) {
  $scope.awesomeThings = [
    'HTML5 Boilerplate',
    'AngularJS',
    'Karma'
  ];
}

UserUseridCtrl.$inject = [
  '$scope'
];

angular.module('robcolbertApp')
.controller('UserUseridCtrl', UserUseridCtrl);
