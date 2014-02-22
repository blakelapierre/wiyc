// controllers/posts/postid/edit.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

angular.module('robcolbertApp')
.controller('PostEditCtrl', [
  '$rootScope',
  '$scope',
  '$route',
  '$location',
  '$sce',
  '$timeout',
  'Configuration',
  'UserSession',
  'Posts',
  function ($rootScope, $scope, $route, $location, $sce, $timeout, Configuration, UserSession, Posts) {

    $scope.user = UserSession;

    $scope.$emit('setPageGroup', 'blog');
    $scope.tinymceOptions = Configuration.tinymceOptions;
    $scope.postContent = '';

    var editor = null;
    $rootScope.$on('tinymceInitComplete', function (event) {
      editor = window.tinymce.editors[window.tinymce.editors.length - 1];
      Posts.get({'postId': $route.current.params.postId}, null, function (post) {
        $scope.post = post;
        editor.setContent(post.content);
        if (angular.isDefined(window.twttr)) {
          //setTimeout(window.twttr.widgets.load, 0);
          window.twttr.widgets.load();
        }
      });
    });

    $scope.updatePost = function ( ) {
      if (!$scope.user.session.authenticated || (editor === null)) {
        return;
      }
      $scope.post.content = editor.getContent();
      $scope.post.$update({'postId':$scope.post._id}, function ( ) {
        $location.path('/posts/'+$scope.post._id);
      });
    };
  }
]);
