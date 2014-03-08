// controllers/posts/post-reader.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

function PostReaderCtrl ($scope, $route, $sce, $window, UserSession, Posts) {

  ga('send', 'pageview');

  $scope.session = UserSession.session;
  $scope.$on('setUserSession', function (event, session) {
    $scope.session = UserSession.session;
  });
  $scope.$on('clearUserSession', function ( ) {
    $scope.session = null;
  });

  $scope.$emit('setPageGroup', 'blog');

  $scope.haveError = false;
  $scope.error = null;

  $scope.post = Posts.get(
    {'postId': $route.current.params.postId},
    null,
    function onPostsGetSuccess ( ) {
      console.log('post loaded', $scope.post);
      ga('send','event', 'Posts', 'loadSuccess', 1);
      $scope.post.excerpt = $sce.trustAsHtml($scope.post.excerpt);
      $scope.post.content = $sce.trustAsHtml($scope.post.content);
      if (angular.isDefined(window.twttr)) {
        setTimeout(window.twttr.widgets.load, 0);
      }
      $window.scrollTo(0, 0);
    },
    function onPostsGetError (error) {
      console.log('Posts.get error', error);
      ga('send', 'event', 'Posts', 'loadError', 1);
      $scope.error = error;
      $scope.haveError = true;
    }
  );

  $scope.calendarMoment = function (date) { return moment(date).calendar(); };
  $scope.fromNow = function (date) { return moment(date).fromNow(); };

  $scope.comment = { }; // empty by default
  $scope.createComment = function ( ) {
    console.log('createComment', $scope.comment);
    Posts.createComment(
      {'postId': $route.current.params.postId},
      $scope.comment,
      function onCommentCreateSuccess (newComment) {
        ga('send','event', 'Posts', 'commentCreateSuccess', 1);
        console.log('comment created', newComment);
        $scope.post.interactions.comments.push(newComment);
        $scope.comment = { }; // empty it out
      },
      function onCommentCreateError (error) {
        console.log('createComment error', error);
        ga('send','event', 'Posts', 'commentCreateError', 1);
        $scope.error = error;
        $scope.haveError = true;
      }
    );
  };
}

PostReaderCtrl.$inject = [
  '$scope',
  '$route',
  '$sce',
  '$window',
  'UserSession',
  'Posts'
];

angular.module('robcolbertApp')
.controller('PostReaderCtrl', PostReaderCtrl);
