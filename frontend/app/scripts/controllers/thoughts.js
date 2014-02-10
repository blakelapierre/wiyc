// controllers/thoughts.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

angular.module('robcolbertApp')
.controller('ThoughtsCtrl', [
  '$scope',
  'Thoughts',
  function ($scope, Thoughts) {

    $scope.thoughts = Thoughts.list(function ( ) {
      console.log('thoughts', $scope.thoughts);
    });

  }

]);
