// controllers/sidebar-pulses.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';
/* global moment:false */

function SidebarPulsesCtrl ($scope, $rootScope, $sce, UserSession, SidebarPulses, Configuration) {

  $scope.session = UserSession.session;
  $scope.ckeditorOptions = angular.copy(Configuration.ckeditorOptions.small);

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
    if (!$scope.session.authenticated.status) {
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

  /*
   * Called by view when user wants to edit a micropulse they created.
   * @param selectedPulse The pulse selected for editing in the sidebar.
   */
  $scope.editPulse = function (selectedPulse) {
    if (!$scope.session.authenticated.status) {
      return;
    }

    console.log('editPulse', arguments);
    selectedPulse.editing = true;

    var pulseDivId = 'micropulse-'+selectedPulse._id.toString();
    console.log('editing micropulse', pulseDivId);

    var micropulseEditor = CKEDITOR.inline(pulseDivId);
    // micropulseEditor.setData('');

    function onMicropulseEditorChange ( ) {
      // $scope.$apply(function ( ) {
      //   selectedPulse.isDirty = true;
      //   selectedPulse.content = micropulseEditor.getData();
      // });
    }

    micropulseEditor.on('change', onMicropulseEditorChange);
    micropulseEditor.on('key', onMicropulseEditorChange);
    micropulseEditor.on('blur', onMicropulseEditorChange);

    var element = angular.element('#'+pulseDivId);
    element.attr('contenteditable', true);
    element.bind('$destroy', function ( ) {
      micropulseEditor.destroy(false);
      micropulseEditor = null;
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

angular.module('pulsarClientApp')
.controller('SidebarPulsesCtrl', SidebarPulsesCtrl);
