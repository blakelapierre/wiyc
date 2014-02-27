// controllers/posts/compose.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

function PostsComposeCtrl ($scope, $rootScope, $location, $window, Configuration, Posts) {
  $window.scrollTo(0, 0);
  $scope.$emit('setPageGroup', 'postComposer');
  $rootScope.$on('clearUserSession', function ( ) {
    $location.path('/');
  });

  $scope.editable = true;
  $scope.tinymceOptions = Configuration.tinymceOptions;
  $scope.post = { };

  $scope.createPost = function ( ) {
    Posts.create($scope.post, function (newPost) {
      console.log('post created', newPost);
      $location.path('/posts/' + newPost._id);
    });
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
  'Posts'
];

angular.module('robcolbertApp')
.controller('PostsComposeCtrl', PostsComposeCtrl);
