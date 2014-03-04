// controllers/posts/post-reader.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

function PostReaderCtrl ($scope, $route, $sce, $window, UserSession, Posts) {

  $scope.user = UserSession;
  $scope.$emit('setPageGroup', 'blog');

  $scope.post = Posts.get({'postId': $route.current.params.postId}, null, function ( ) {
    console.log('post loaded', $scope.post);
    $scope.post.excerpt = $sce.trustAsHtml($scope.post.excerpt);
    $scope.post.content = $sce.trustAsHtml($scope.post.content);
    if (angular.isDefined(window.twttr)) {
      setTimeout(window.twttr.widgets.load, 0);
    }
    $window.scrollTo(0, 0);
  });

  $scope.calendarMoment = function (date) { return moment(date).calendar(); };
  $scope.fromNow = function (date) { return moment(date).fromNow(); };

  $scope.comment = { }; // empty by default
  $scope.createComment = function ( ) {
    console.log('createComment', $scope.comment);
    Posts.createComment({'postId': $route.current.params.postId}, $scope.comment, function (newComment) {
      console.log('comment created', newComment);
      $scope.post.interactions.comments.push(newComment);
      $scope.comment = { }; // empty it out
    });
  };
}

PostReaderCtrl.$inject = [
  '$scope',
  '$route',
  '$sce',
  '$window',
  'UserSession',
  'Posts'
];

angular.module('robcolbertApp')
.controller('PostReaderCtrl', PostReaderCtrl);
