// controllers/posts.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';
/* global twttr:false */
/* global moment:false */

function PostsCtrl ($scope, Posts) {
  $scope.$emit('setPageGroup', 'blog');
  $scope.posts = Posts.list(function ( ) {
    console.log('posts have arrived', $scope.posts);
    setTimeout(twttr.widgets.load, 0);
  });

  $scope.calendarMoment = function (date) { return moment(date).calendar(); };
  $scope.fromNow = function (date) { return moment(date).fromNow(); };

}

PostsCtrl.$inject = [
  '$scope',
  'Posts'
];

angular.module('robcolbertApp')
.controller('PostsCtrl', PostsCtrl);
