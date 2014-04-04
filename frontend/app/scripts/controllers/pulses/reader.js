// controllers/pulses/reader.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function PulseReaderCtrl ($scope, $route, $sce, $window, $location, UserSession, Pulses, Configuration) {

  ga('send', 'pageview');

  $scope.tinymceOptions = Configuration.tinymceOptions;
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

  $scope.pulse = Pulses.get(
    {'pulseId': $route.current.params.pulseId},
    null,
    function onPulsesGetSuccess ( ) {
      console.log('pulse loaded', $scope.pulse);
      ga('send','event', 'Pulses', 'loadSuccess', 1);
      $scope.pulse.excerpt = $sce.trustAsHtml($scope.pulse.excerpt);
      $scope.pulse.content = $sce.trustAsHtml($scope.pulse.content);
      if (angular.isDefined(window.twttr)) {
        setTimeout(window.twttr.widgets.load, 0);
      }
      $window.scrollTo(0, 0);
    },
    function onPulsesGetError (error) {
      console.log('Pulses.get error', error);
      ga('send', 'event', 'Pulses', 'loadError', 1);
      $scope.error = error;
      $scope.haveError = true;
    }
  );

  $scope.calendarMoment = function (date) { return moment(date).calendar(); };
  $scope.fromNow = function (date) { return moment(date).fromNow(); };

  $scope.comment = { }; // empty by default
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
        tinyMCE.activeEditor.setContent('');
      },
      function onCommentCreateError (error) {
        console.log('createComment error', error);
        ga('send','event', 'Pulses', 'commentCreateError', 1);
        $scope.error = error;
        $scope.haveError = true;
      }
    );
  };

  $scope.deletePulse = function ( ) {
    Pulses.delete(
      {'pulseId': $scope.pulse._id},
      function onDeleteSuccess ( ) {
        var modal = angular.element('#pulseDeleteConfirmModal');
        modal.on('hidden.bs.modal', function (e) {
          $location.path('/#/pulses');
        });
        modal.modal('hide');
      },
      function onDeleteError (error) {
        console.log('pulse delete error', error);
      }
    );
  };
}

PulseReaderCtrl.$inject = [
  '$scope',
  '$route',
  '$sce',
  '$window',
  '$location',
  'UserSession',
  'Pulses',
  'Configuration'
];

angular.module('robcolbertApp')
.controller('PulseReaderCtrl', PulseReaderCtrl);
