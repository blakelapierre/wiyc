/*
 * FILE
 *  controllers/pulses/pulseId/edit.js
 *
 * PURPOSE
 *
 *
 * LICENSE
 *  Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to
 *  deal in the Software without restriction, including without limitation the
 *  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 *  sell copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 *  IN THE SOFTWARE.
 */

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

  $scope.updatePulse = function ( ) {
    if (!$scope.session.authenticated.status || (editor === null)) {
      return;
    }
    $scope.pulse.content = editor.getContent();
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

