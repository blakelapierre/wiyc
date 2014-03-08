// controllers/posts.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';
/* global twttr:false */
/* global moment:false */

function PostsCtrl ($scope, $window, Posts) {
  $window.scrollTo(0, 0);
  $scope.$emit('setPageGroup', 'blog');
  ga('send', 'pageview');

  $scope.posts = Posts.list(function ( ) {
    ga('send','event', 'Posts', 'listed', $scope.posts.length);
    console.log('posts have arrived', $scope.posts);
    setTimeout(twttr.widgets.load, 0);
  });

  $scope.calendarMoment = function (date) { return moment(date).calendar(); };
  $scope.fromNow = function (date) { return moment(date).fromNow(); };

}

PostsCtrl.$inject = [
  '$scope',
  '$window',
  'Posts'
];

angular.module('robcolbertApp')
.controller('PostsCtrl', PostsCtrl);
