// controllers/congressperson.js
// Copyright (C) 2014 Blake La Pierre <blakelapierre@gmail.com>
// License: MIT

'use strict';

function CongresspersonCtrl ($scope, $route, $rootScope, $window, Congresspeople) {
  $window.scrollTo(0, 0);
  ga('send', 'pageview');

  $scope.congressperson = Congresspeople.get({name: $route.current.params.name});
}

CongresspersonCtrl.$inject = [
  '$scope',
  '$route',
  '$rootScope',
  '$window',
  'Congresspeople'
];

angular.module('wiyc')
.controller('CongresspersonCtrl', CongresspersonCtrl);
