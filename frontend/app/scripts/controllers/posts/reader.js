// controllers/posts/post-reader.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

angular.module('robcolbertApp')
.controller('PostReaderCtrl', [
  '$scope',
  '$route',
  'Posts',
  function ($scope, $route, Posts) {
    $scope.$emit('setPageGroup', 'blog');
    $scope.post = Posts.get({'postId': $route.current.params.postId}, null, function ( ) {
      console.log('post loaded', $scope.post);
      setTimeout(twttr.widgets.load, 0);
    });

    $scope.comment = { }; // empty by default
    $scope.createComment = function ( ) {
      console.log('createComment', $scope.comment);
      Posts.createComment({'postId': $route.current.params.postId}, $scope.comment, function (newComment) {
        $scope.post.comments.push(newComment);
        $scope.comment = { }; // empty it out
      });
    };
  }
]);
