// controllers/pulses/pulseId/edit.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function PulseEditCtrl (
  $rootScope,
  $scope,
  $window,
  $route,
  $location,
  $sce,
  $timeout,
  Configuration,
  UserSession,
  Pulses
) {

  $window.scrollTo(0, 0);
  CKEDITOR.disableAutoInline = true;
  $scope.session = UserSession.session;

  ga('send','pageview');
  $scope.$emit('setPageGroup', 'blog');

  var excerptEditor = null;
  var contentEditor = null;

  $scope.pulseStatuses = Configuration.pulseStatuses;
  $scope.pulseVisibilityValues = Configuration.pulseVisibilityValues;

  function onExcerptEditorChange ( ) {
    $scope.$apply(function ( ) {
      $scope.isDirty = true;
      $scope.pulse.excerpt = excerptEditor.getData();
    });
  }
  function onContentEditorChange ( ) {
    $scope.$apply(function ( ) {
      $scope.isDirty = true;
      $scope.pulse.content = contentEditor.getData();
    });
  }

  $scope.isDirty = false;
  $scope.haveError = false;
  $scope.error = { };

  Pulses.get(
    {'pulseId': $route.current.params.pulseId},
    null,
    function onPulseLoadSuccess (pulse) {
      if (!$scope.session.authenticated.status || (pulse._creator._id !== $scope.session.user._id)) {
        $location.path('/');  // send them home; and
        return;               // refuse to provide an editable interface for the pulse data.
      }
      $scope.pulse = pulse;
      console.log('pulse loaded', pulse);
      if (angular.isDefined(window.twttr)) {
        //setTimeout(window.twttr.widgets.load, 0);
        window.twttr.widgets.load();
      }
    }
  );

  $scope.calendarMoment = function (date) { return moment(date).calendar(); };
  $scope.fromNow = function (date) { return moment(date).fromNow(); };

  $scope.updatePulse = function ( ) {
    if ($scope.pulse._creator._id !== $scope.session.user._id) {
      return; // same test occurs in the REST method
    }
    Pulses.update(
      {'pulseId':$scope.pulse._id},
      $scope.pulse,
      function onPulseUpdateSuccess (pulse) {
        $scope.isDirty = false;
        $location.path('/pulses/' + pulse._id.toString());
      },
      function onPulseUpdateError (error) {
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
          $location.path('/pulses');
        });
        modal.modal('hide');
      },
      function onDeleteError (error) {
        console.log('pulse delete error', error);
      }
    );
  };
}

PulseEditCtrl.$inject = [
  '$rootScope',
  '$scope',
  '$window',
  '$route',
  '$location',
  '$sce',
  '$timeout',
  'Configuration',
  'UserSession',
  'Pulses'
];

angular.module('pulsarClientApp')
.controller('PulseEditCtrl', PulseEditCtrl);
