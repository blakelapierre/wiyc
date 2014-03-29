/*
/* FILE
 *  controllers/sidebar-pulses.js
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
/* global moment:false */

function SidebarPulsesCtrl ($scope, $rootScope, $sce, UserSession, SidebarPulses, Configuration) {

  $scope.user = UserSession;
  $scope.tinymceOptions = Configuration.tinymceOptions;

  $scope.composer = {
    'visible': false,
    'newPulse': function ( ) {
      $scope.composer.pulse = {
        'content': ''
      };
    }
  };
  $scope.composer.newPulse();

  SidebarPulses.list(function (pulses) {
    ga('send','event', 'Pulses', 'listed', pulses.length);
    pulses.forEach(function (pulse) {
      pulse.content = $sce.trustAsHtml('<p>' + pulse.content.replace(/\n+/g, '</p><p>') + '</p>');
    });
    console.log('sidebar pulses have arrived', pulses);
    $scope.pulses = pulses;
    if (angular.isDefined(window.twttr)) {
      setTimeout(window.twttr.widgets.load, 0);
    }
  });

  $rootScope.$on('clearUserSession', function ( ) {
    $scope.composer.visible = false;
    $scope.composer.newPulse();
  });

  $scope.dateAsMoment = function (date) { return moment(date).calendar(); };

  $scope.createPulse = function ( ) {
    if (!$scope.user.session.authenticated.status) {
      // Not authenticated, don't even know how you got here, but...no.
      // But, relax. This is only a best effort. The back end isn't going
      // to accept the pulse even if submitted via curl, though.
      return;
    }
    SidebarPulses.create($scope.composer.pulse, function (pulse) {
      ga('send','event', 'Pulses', 'created', 1);
      $scope.pulses.unshift(pulse);
      $scope.composer.visible = false;
      $scope.composer.newPulse();
      if (angular.isDefined(window.twttr)) {
        setTimeout(window.twttr.widgets.load, 0);
      }
    });
  };

}

SidebarPulsesCtrl.$inject = [
  '$scope',
  '$rootScope',
  '$sce',
  'UserSession',
  'SidebarPulses',
  'Configuration'
];

angular.module('robcolbertApp')
.controller('SidebarPulsesCtrl', SidebarPulsesCtrl);
