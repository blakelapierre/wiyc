// controllers/posts/compose.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

angular.module('robcolbertApp')
.controller('PostsComposeCtrl', [
  '$scope',
  'Posts',
  function ($scope, Posts) {

    $scope.editable = false;
    $scope.tinymceOptions = {
      'skin': 'lightgray',
      'theme': 'modern',
      'resize': false,
      'height': 400,
      'fixed_toolbar_container': '#editor-toolbar'
    };
    
    $scope.post = { };
    $scope.createPost = function ( ) {
      Posts.create($scope.post, function (newPost) {
        console.log('post created', newPost);
      });
    };
  }
]);
