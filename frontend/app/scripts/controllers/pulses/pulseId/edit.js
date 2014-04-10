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

  var element;
  var excerptEditor = null;
  var contentEditor = null;

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

      element = angular.element('#titleEditor');
      element.attr('contenteditable', true);

      /*
       * Not really sure which approach is smarter for updates:
       *
       * 1. Using the change event's .editor property? or
       * 2. Using my already known editor references?
       *
       * I know I can trust my references. Or, can I? We'll find out.
       * Going with references for now, but leaving this note here for
       * myself as a reminder if it blows up or isn't the best approach
       * learned another way.
       */

      excerptEditor = CKEDITOR.inline('excerptEditor');
      excerptEditor.setData(pulse.excerpt);
      excerptEditor.on('change', onExcerptEditorChange);
      excerptEditor.on('key', onExcerptEditorChange);
      excerptEditor.on('blur', onExcerptEditorChange);

      element = angular.element('#excerptEditor');
      element.attr('contenteditable', true);
      element.bind('$destroy', function ( ) {
        excerptEditor.destroy(false);
        excerptEditor = null;
      });

      contentEditor = CKEDITOR.inline('contentEditor');
      contentEditor.setData(pulse.content);
      contentEditor.on('change', onContentEditorChange);
      contentEditor.on('key', onContentEditorChange);
      contentEditor.on('blur', onContentEditorChange);

      element = angular.element('#contentEditor');
      element.attr('contenteditable', true);
      element.bind('$destroy', function ( ) {
        contentEditor.destroy(false);
        contentEditor = null;
      });

      console.log('in-place editors enabled');
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
