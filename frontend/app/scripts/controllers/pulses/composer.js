/*
 * FILE
 *  controllers/pulses/compose.js
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

function PulsarComposerCtrl ($scope, $rootScope, $location, $window, Configuration, UserSession, Pulses) {
  $window.scrollTo(0, 0);

  $scope.$emit('setPageGroup', 'blog');
  $scope.haveError = false;
  $scope.errorMessage = '';

  $rootScope.$on('clearUserSession', function ( ) {
    $location.path('/');
  });

  $scope.editable = true;
  $scope.tinymceOptions = Configuration.tinymceOptions;
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
        console.log('pulses.create error', error);
        ga('send','event', 'Pulses', 'createError', 1);
        $scope.haveError = true;
        $scope.error = error;
      }
    );
  };

  $scope.refreshWidgets = function ( ) {
    twttr.widgets.load();
  };
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

angular.module('robcolbertApp')
.controller('PulsarComposerCtrl', PulsarComposerCtrl);
