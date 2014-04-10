// controllers/pulses/compose.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function PulsarComposerCtrl ($scope, $rootScope, $location, $window, Configuration, UserSession, Pulses) {

  $window.scrollTo(0, 0);
  CKEDITOR.disableAutoInline = true;
  $scope.session = UserSession.session;

  ga('send','pageview');
  $scope.$emit('setPageGroup', 'blog');

  $scope.updatePageTitle = function ( ) {
    var title = 'Pulsar Composer';
    if ($scope.pulse.title.length) {
      title += ' | ' + $scope.pulse.title;
    }
    $scope.$emit('setPageInformation', {
      'title': title,
      'attribution': UserSession.session.user
    });
  };

  $scope.$emit('setPageInformation', {
    'title': 'Pulsar Composer',
    'attribution': UserSession.session.user
  });

  var element;
  var excerptEditor = null;
  var contentEditor = null;

  $scope.isDirty = false;

  $rootScope.$on('clearUserSession', function ( ) {
    $location.path('/');
  });

  $scope.calendarMoment = function (date) { return moment(date).calendar(); };
  $scope.fromNow = function (date) { return moment(date).fromNow(); };

  $scope.pulse = { };
  $scope.createPulse = function ( ) {
    Pulses.create(
      $scope.pulse,
      function onCreatePulseSuccess (newPulse) {
        console.log('pulse created', newPulse);
        ga('send','event', 'Pulses', 'createSuccess', 1);
        $location.path('/pulses/' + newPulse._id);
      },
      function onCreatePulseError (error) {
        ga('send','event', 'Pulses', 'createError', 1);
        $scope.$emit('setServiceError', error);
      }
    );
  };

  $scope.refreshWidgets = function ( ) {
    twttr.widgets.load();
  };

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
  excerptEditor.setData('');
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
  contentEditor.setData('');
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

PulsarComposerCtrl.$inject = [
  '$scope',
  '$rootScope',
  '$location',
  '$window',
  'Configuration',
  'UserSession',
  'Pulses'
];

angular.module('pulsarClientApp')
.controller('PulsarComposerCtrl', PulsarComposerCtrl);
