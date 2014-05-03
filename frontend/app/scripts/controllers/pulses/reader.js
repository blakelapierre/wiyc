// controllers/pulses/reader.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function PulseReaderCtrl ($scope, $route, $sce, $timeout, $window, $location, UserSession, Pulses, Configuration) {

  $window.scrollTo(0, 0);
  ga('send', 'pageview');
  $scope.$emit('setPageGroup', 'blog');

  $scope.session = UserSession.session;
  $scope.$on('setUserSession', function (event, session) {
    $scope.session = UserSession.session;
  });
  $scope.$on('clearUserSession', function ( ) {
    $scope.session = null;
  });

  $scope.loaded = false;
  $scope.haveError = false;
  $scope.error = null;
  $scope.comment = {
    'content': '<p></p>'
  };

  $scope.pulse = Pulses.get(
    {'pulseId': $route.current.params.pulseId},
    null,
    function onPulseGetSuccess (pulse) {
      console.log('there are', $scope.contentEditors.length, 'content editors');
      $scope.loaded = true;
      $scope.contentEditors[0].on('instanceReady', function ( ) {
        $scope.$apply(function ( ) { $scope.commentEditorVisible = false; });
      });
      $scope.contentEditors[0].on('readOnly', function (event) {
        console.log('EDITOR READ ONLY EVENT', event.editor);
      });
      ga('send','event', 'Pulses', 'loadSuccess', 1);
      $scope.$emit('setPageInformation', {
        'title': $scope.pulse.title,
        'attribution': $scope.pulse._creator
      });
      if (angular.isDefined($window.twttr)) {
        setTimeout($window.twttr.widgets.load, 0);
      }
    },
    function onPulseGetError (error) {
      console.log('Pulses.get error', error);
      ga('send', 'event', 'Pulses', 'loadError', 1);
      $scope.error = error;
      $scope.haveError = true;
    }
  );

  $scope.calendarMoment = function (date) { return moment(date).calendar(); };
  $scope.fromNow = function (date) { return moment(date).fromNow(); };

  $scope.focusCommentEditor = function ( ) {
    $scope.contentEditors[0].setMode();
    $timeout(function ( ) {
      var editor = angular.element('#comment-editor');
      editor[0].focus();
    }, 0);
  };

  $scope.createComment = function ( ) {
    console.log('createComment', $scope.comment);
    Pulses.createComment(
      {'pulseId': $route.current.params.pulseId},
      $scope.comment,
      function onCommentCreateSuccess (newComment) {
        ga('send','event', 'Pulses', 'commentCreateSuccess', 1);
        console.log('comment created', newComment);
        $scope.pulse.interactions.comments.push(newComment);
        $scope.commentEditorVisible = false;
        $scope.comment = { };
      },
      function onCommentCreateError (error) {
        console.log('createComment error', error);
        ga('send','event', 'Pulses', 'commentCreateError', 1);
        $scope.error = error;
        $scope.haveError = true;
      }
    );
  };

}

PulseReaderCtrl.$inject = [
  '$scope',
  '$route',
  '$sce',
  '$timeout',
  '$window',
  '$location',
  'UserSession',
  'Pulses',
  'Configuration'
];

angular.module('pulsarClientApp')
.controller('PulseReaderCtrl', PulseReaderCtrl);
