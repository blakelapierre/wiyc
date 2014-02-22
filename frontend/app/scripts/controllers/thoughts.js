// controllers/thoughts.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

angular.module('robcolbertApp')
.controller('ThoughtsCtrl', [
  '$scope',
  '$rootScope',
  'UserSession',
  'Thoughts',
  function ($scope, $rootScope, UserSession, Thoughts) {

    $scope.user = UserSession;
    $scope.thoughts = Thoughts.list({'p':1, 'cpp':5}, function ( ) {
      console.log('thoughts', $scope.thoughts);
    });

    $rootScope.$on('clearUserSession', function ( ) {
      $scope.showComposer = false;
      $scope.newThought = { };
    });

    $scope.newThought = { };
    $scope.postThought = function ( ) {
      if (!$scope.user.authenticated) {
        // Not authenticated, don't even know how you got here, but...no.
        // But, relax. This is only a best effort. The back end isn't going
        // to accept the thought even if submitted via curl.
        return;
      }
      Thoughts.create($scope.newThought, function (thought) {
        $scope.thoughts.unshift(thought);
        $scope.showComposer = false;
        $scope.newThought = { };
      });
    };

  }

]);
