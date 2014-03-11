// controllers/posts.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';
/* global twttr:false */
/* global moment:false */

function PostsCtrl ($scope, $route, $window, Posts) {
  $window.scrollTo(0, 0);

  $scope.$emit('setPageGroup', 'blog');
  ga('send', 'pageview');

  $scope.currentPage = parseInt($route.current.params.p) || 1;
  $scope.postsPerPage = parseInt($route.current.params.cpp) || 3;

  $scope.posts = Posts.list(
    {
      'p': $scope.currentPage,
      'cpp':$scope.postsPerPage
    },
    function ( ) {
      var idx, maxPages = $scope.posts.count / $scope.postsPerPage;

      console.log('posts have arrived', $scope.posts);
      setTimeout(twttr.widgets.load, 0);

      $scope.pages = [ ];
      for (idx = $scope.currentPage - 3; idx <= maxPages; ++idx) {
        if (idx >= 1) {
          $scope.pages.push(idx);
        }
      }
      ga('send','event', 'Posts', 'listed', $scope.posts.length);
    }
  );

  $scope.calendarMoment = function (date) { return moment(date).calendar(); };
  $scope.fromNow = function (date) { return moment(date).fromNow(); };

}

PostsCtrl.$inject = [
  '$scope',
  '$route',
  '$window',
  'Posts'
];

angular.module('robcolbertApp')
.controller('PostsCtrl', PostsCtrl);
