// controllers/pulses/compose.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function PulsarComposerCtrl ($scope, $rootScope, $location, $window, Configuration, UserSession, Pulses) {

  $window.scrollTo(0, 0);
  CKEDITOR.disableAutoInline = true;

  $scope.session = UserSession.session;
  $scope.pulseStatuses = Configuration.pulseStatuses;
  $scope.pulseVisibilityValues = Configuration.pulseVisibilityValues;

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

  $scope.pulse = {
    'visibility': 'public',
    'status': 'draft'
  };

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
        $scope.$emit('pulsarServiceError', error);
      }
    );
  };

  $scope.refreshWidgets = function ( ) {
    twttr.widgets.load();
  };

  element = angular.element('#titleEditor');
  element.attr('contenteditable', true);
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
