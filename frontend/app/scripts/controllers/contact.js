// controllers/contact.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function ContactCtrl ($scope, $window) {
  $window.scrollTo(0, 0);
  $scope.$emit('setPageGroup', 'contact');
  ga('send', 'pageview');
}

ContactCtrl.$inject = [
  '$scope',
  '$window'
];

angular.module('robcolbertApp')
.controller('ContactCtrl', ContactCtrl);
