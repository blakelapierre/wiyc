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

    $scope.session = UserSession.session;

    $scope.$emit('setPageGroup', 'blog');
    $scope.tinymceOptions = Configuration.tinymceOptions;
    $scope.postContent = '';

    var editor = null;
    $rootScope.$on('tinymceInitComplete', function (event) {
      editor = window.tinymce.editors[window.tinymce.editors.length - 1];
      Posts.get({'postId': $route.current.params.postId}, null, function (post) {
        if (!$scope.session.authenticated.status || (post._creator._id !== $scope.session.user._id)) {
          $location.path('/');  // send them home; and
          return;               // refuse to provide an editable interface for the post data.
        }
        $scope.post = post;
        editor.setContent(post.content);
        if (angular.isDefined(window.twttr)) {
          //setTimeout(window.twttr.widgets.load, 0);
          window.twttr.widgets.load();
        }
      });
    });

    $scope.updatePost = function ( ) {
      if (!$scope.session.authenticated.status || (editor === null)) {
        return;
      }
      $scope.post.content = editor.getContent();
      $scope.post.$update({'postId':$scope.post._id}, function ( ) {
        $location.path('/posts/'+$scope.post._id);
      });
    };
  }
]);
