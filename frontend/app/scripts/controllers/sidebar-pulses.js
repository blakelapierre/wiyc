// controllers/sidebar-pulses.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';
/* global moment:false */

function SidebarPulsesCtrl ($scope, $rootScope, $sce, UserSession, SidebarPulses, Configuration) {

  $scope.user = UserSession;
  $scope.ckeditorOptions = angular.copy(Configuration.ckeditorOptions.small);
  $scope.ckeditorOptions.toolbar = [
    [
      'Bold', 'Italic',
      '-',
      'NumberedList', 'BulletedList',
      '-',
      'Link', 'Unlink',
      '-',
      'Image','SpecialChar','Iframe'

    ]
  ]

  $scope.composer = {
    'visible': false,
    'content': '',
    'newPulse': function ( ) { this.content = ''; }
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
    SidebarPulses.create(
      {'content':$scope.composer.content},
      function onPulseCreateSuccess (pulse) {
        ga('send','event', 'Pulses', 'created', 1);
        $scope.pulses.unshift(pulse);
        $scope.composer.newPulse();
        $scope.composer.visible = false;
        if (angular.isDefined(window.twttr)) {
          setTimeout(window.twttr.widgets.load, 0);
        }
      },
      function onPulseCreateError (error) {
        console.log('pulse create error', error);
      }
    );
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
