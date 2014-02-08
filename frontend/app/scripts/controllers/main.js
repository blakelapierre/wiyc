// controllers/main.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

angular.module('robcolbertApp')
.controller('MainCtrl', [
  '$scope',
  'Posts',
  function ($scope, Posts) {
    Posts.list(function (posts) {
      $.each(posts, function (index, post) {
        post.excerpt = post.content;
      });
      $scope.posts = posts;
    });
  }
]);
