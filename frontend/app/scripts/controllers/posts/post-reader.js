'use strict';

angular.module('robcolbertApp')
.controller('PostsPostReaderCtrl', [
  '$scope',
  '$route',
  'Posts',
  function ($scope, $route, Posts) {
    $scope.post = Posts.get({'postId': $route.current.params.postId}, null, function ( ) {
      console.log('post loaded', $scope.post);
    });
    
    $scope.comment = { }; // empty by default
    $scope.createComment = function ( ) {
      console.log('createComment', $scope.comment);
      Posts.createComment({'postId': $route.current.params.postId}, $scope.comment, function (newComment) {
        $scope.post.comments.push(newComment);
      });
    };
  }
]);
