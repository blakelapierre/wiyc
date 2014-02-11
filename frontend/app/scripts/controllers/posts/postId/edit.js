// controllers/posts/postid/edit.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

angular.module('robcolbertApp')
.controller('PostEditCtrl', [
  '$scope',
  '$route',
  '$sce',
  'Configuration',
  'Posts',
  function ($scope, $route, $sce, Configuration, Posts) {
    $scope.$emit('setPageGroup', 'blog');
    $scope.tinymceOptions = Configuration.tinymceOptions;
    $scope.post = Posts.get({'postId': $route.current.params.postId}, null, function ( ) {
      console.log('post loaded', $scope.post);
      $scope.post.excerpt = $sce.trustAsHtml($scope.post.excerpt);
      $scope.post.content = $sce.trustAsHtml($scope.post.content);
      setTimeout(twttr.widgets.load, 0);
    });

    $scope.updatePost = function ( ) {
      $scope.post.$update({'postId':$scope.post._id});
    };
  }
]);
