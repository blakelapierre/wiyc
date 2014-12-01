// controllers/congresspeople.js
// Copyright (C) 2014 Blake La Pierre <blakelapierre@gmail.com>
// License: MIT

'use strict';

function CongresspeopleCtrl ($scope, $rootScope, $window, Congresspeople) {
  $window.scrollTo(0, 0);
  ga('send', 'pageview');

  $rootScope.$broadcast('showMessage', 'Loading Congresspeople...');

  $scope.congresspeople = Congresspeople.list();
}

CongresspeopleCtrl.$inject = [
  '$scope',
  '$rootScope',
  '$window',
  'Congresspeople'
];

angular.module('wiyc')
.controller('CongresspeopleCtrl', CongresspeopleCtrl);
