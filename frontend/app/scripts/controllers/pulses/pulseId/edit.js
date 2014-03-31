// controllers/pulses/pulseId/edit.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function PulseEditCtrl (
  $rootScope,
  $scope,
  $route,
  $location,
  $sce,
  $timeout,
  Configuration,
  UserSession,
  Pulses
) {

  $scope.session = UserSession.session;
  ga('send','pageview');

  $scope.$emit('setPageGroup', 'blog');

  $scope.tinymceOptionsContent = angular.copy(Configuration.tinymceOptions);
  $scope.tinymceOptionsExcerpt = angular.copy(Configuration.tinymceOptions);

  $scope.pulseContent = '';
  $scope.haveError = false;
  $scope.error = '';

  var contentEditor = null;
  var excerptEditor = null;
  $rootScope.$on('tinymceInitComplete', function (event) {
    contentEditor = window.tinymce.editors[window.tinymce.editors.length - 2];
    excerptEditor = window.tinymce.editors[window.tinymce.editors.length - 1];
    Pulses.get({'pulseId': $route.current.params.pulseId}, null, function (pulse) {
      if (!$scope.session.authenticated.status || (pulse._creator._id !== $scope.session.user._id)) {
        console.log('BONK');
        $location.path('/');  // send them home; and
        return;               // refuse to provide an editable interface for the pulse data.
      }
      $scope.pulse = pulse;
      contentEditor.setContent(pulse.content);
      excerptEditor.setContent(pulse.excerpt);
      if (angular.isDefined(window.twttr)) {
        //setTimeout(window.twttr.widgets.load, 0);
        window.twttr.widgets.load();
      }
    });
  });

  $scope.calendarMoment = function (date) { return moment(date).calendar(); };
  $scope.fromNow = function (date) { return moment(date).fromNow(); };

  $scope.updatePulse = function ( ) {
    if (!$scope.session.authenticated.status || (contentEditor === null) || (excerptEditor === null)) {
      return;
    }

    $scope.pulse.content = contentEditor.getContent();
    $scope.pulse.excerpt = excerptEditor.getContent();

    $scope.pulse.$update(
      {'pulseId':$scope.pulse._id},
      function onPulseUpdateSuccess ( ) {
        ga('send','event', 'Pulses', 'updateSuccess', 1);
        $location.path('/pulses/'+$scope.pulse._id);
      },
      function onPulseUpdateError (error) {
        ga('send','event', 'Pulses', 'updateError', 1);
        $scope.error = error;
        $scope.haveError = true;
      }
    );
  };
}

PulseEditCtrl.$inject = [
  '$rootScope',
  '$scope',
  '$route',
  '$location',
  '$sce',
  '$timeout',
  'Configuration',
  'UserSession',
  'Pulses'
];

angular.module('robcolbertApp')
.controller('PulseEditCtrl', PulseEditCtrl);

