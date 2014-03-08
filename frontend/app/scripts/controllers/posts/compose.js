// controllers/posts/compose.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

function PostsComposeCtrl ($scope, $rootScope, $location, $window, Configuration, UserSession, Posts) {
  $window.scrollTo(0, 0);

  $scope.$emit('setPageGroup', 'postComposer');
  $scope.haveError = false;
  $scope.errorMessage = '';

  $rootScope.$on('clearUserSession', function ( ) {
    $location.path('/');
  });

  $scope.editable = true;
  $scope.tinymceOptions = Configuration.tinymceOptions;
  $scope.post = { };

  $scope.createPost = function ( ) {
    Posts.create(
      $scope.post,
      function onCreatePostSuccess (newPost) {
        console.log('post created', newPost);
        ga('send','event', 'Posts', 'createSuccess', 1);
        $location.path('/posts/' + newPost._id);
      },
      function onCreatePostError (error) {
        console.log('posts.create error', error);
        ga('send','event', 'Posts', 'createError', 1);
        $scope.haveError = true;
        $scope.error = error;
      }
    );
  };

  $scope.refreshWidgets = function ( ) {
    twttr.widgets.load();
  };
}

PostsComposeCtrl.$inject = [
  '$scope',
  '$rootScope',
  '$location',
  '$window',
  'Configuration',
  'UserSession',
  'Posts'
];

angular.module('robcolbertApp')
.controller('PostsComposeCtrl', PostsComposeCtrl);
