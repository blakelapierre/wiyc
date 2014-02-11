// controllers/posts/postid/edit.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

angular.module('robcolbertApp')
.controller('PostEditCtrl', [
  '$scope',
  '$route',
  '$location',
  '$sce',
  'Configuration',
  'Posts',
  function ($scope, $route, $location, $sce, Configuration, Posts) {
    $scope.$emit('setPageGroup', 'blog');
    $scope.tinymceOptions = Configuration.tinymceOptions;
    $scope.post = Posts.get({'postId': $route.current.params.postId}, null, function ( ) {
      console.log('post loaded', $scope.post);
      if (angular.isDefined(window.twttr)) {
        setTimeout(window.twttr.widgets.load, 0);
      }
    });

    $scope.updatePost = function ( ) {
      if (angular.isObject($scope.post.content)) {
        console.log('post content as object', $scope.post.content);
      } else {
        $scope.post.$update({'postId':$scope.post._id}, function ( ) {
          console.log('$location', $location);
          $location.path('/posts/'+$scope.post._id);
        });
      }
    };
  }
]);
