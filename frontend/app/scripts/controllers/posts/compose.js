// controllers/posts/compose.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

angular.module('robcolbertApp')
.controller('PostsComposeCtrl', [
  '$scope',
  'Configuration',
  'Posts',
  function ($scope, Configuration, Posts) {

    $scope.editable = true;
    $scope.tinymceOptions = Configuration.tinymceOptions;

    $scope.editable = false;
    $scope.$emit('setPageGroup', 'blog');

    $scope.post = { };
    $scope.createPost = function ( ) {
      Posts.create($scope.post, function (newPost) {
        console.log('post created', newPost);
      });
    };

    $scope.refreshWidgets = function ( ) {
      twttr.widgets.load();
    };
  }
]);
