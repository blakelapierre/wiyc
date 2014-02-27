// controllers/main.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';
/*global twttr:false */

function MainCtrl ($scope, $window, UserSession, Thoughts, Posts) {
  $window.scrollTo(0, 0);
  $scope.user = UserSession;
  $scope.$emit('setPageGroup', 'blog');
  $scope.thoughts = Thoughts.list();
  $scope.posts = Posts.list(function ( ) {
    console.log('posts have arrived', $scope.posts);
    setTimeout(twttr.widgets.load, 0);
  });
}

MainCtrl.$inject = [
  '$scope',
  '$window',
  'UserSession',
  'Thoughts',
  'Posts'
];

angular.module('robcolbertApp')
.controller('MainCtrl', MainCtrl);
