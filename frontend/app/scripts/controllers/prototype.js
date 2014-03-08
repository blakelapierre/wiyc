// controllers/prototype.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

function PrototypeCtrl ($scope, $window, $interval, $sce) {

  $window.scrollTo(0, 0);
  $scope.$emit('setPageGroup', 'prototype');

  $scope.ready = false;
  $scope.started = false;
  $scope.cp = 0;

  $scope.bpm = 174;
  $scope.millsPerBeat = Math.round((60.0 / $scope.bpm) * 1000.0);

  $scope.launchExperience = function ( ) {
    $scope.started = true;
    $scope.player.play();
  };

  $scope.attachToPlayer = function (elementId) {

    $scope.player = window.SC.Widget(elementId);

    $scope.playProgress = null;

    $scope.$watch('playProgress', function ( ) {
      if ($scope.playProgress === null) {
        return;
      }
      $scope.cp = $scope.playProgress.currentPosition; // it's used EVERYWHERE

      var startTime = 25360.0;
      var timeSpan = 66000.0 - startTime;
      var blendRatio = 1.0 - (($scope.cp - startTime) / timeSpan);

      $('#waveformImage').css('left', -8192 * ($scope.cp / $scope.durationMills));
      $('#waveformImage').css('background-color', 'rgba(0,0,0,' + blendRatio + ')');

      var seconds = Math.round($scope.playProgress.currentPosition / 1000.0);
      var h = Math.floor(((seconds / 86400.0) % 1) * 24);
      var m = Math.floor(((seconds / 3600.0) % 1) * 60);
      var s = Math.round(((seconds / 60.0) % 1) * 60);
      $scope.playProgress.currentTime = {
        'h': (h < 10) ? ('0' + h.toString()) : h.toString(),
        'm': (m < 10) ? ('0' + m.toString()) : m.toString(),
        's': (s < 10) ? ('0' + s.toString()) : s.toString()
      };
    });

    $scope.currentSound = null;

    $scope.player.bind(SC.Widget.Events.READY, function ( ) {
      console.log('SC.READY', JSON.stringify(arguments));
      $scope.ready = true;
    });

    $scope.player.bind(SC.Widget.Events.PLAY, function ( ) {
      console.log('SC.PLAY', arguments);
      $scope.player.getDuration(function (durationMills) {
        console.log('track duration (mills)', durationMills);
        $scope.durationMills = durationMills;
      });

      $scope.player.getCurrentSound(function (currentSound) {
        console.log('currentSound', currentSound);
        $scope.$apply(function ( ) {
          $scope.started = true;
          $scope.currentSound = currentSound;
          if (currentSound.downloadable) {
            $scope.currentSound.download_url = $sce.trustAsUrl(currentSound.download_url);
          }
          if ($scope.currentSound.purchase_url) {
            $scope.currentSound.purchase_url = $sce.trustAsUrl(currentSound.purchase_url);
          }
          if ($scope.currentSound.waveform_url) {
            $scope.currentSound.waveform_url = $sce.trustAsUrl($scope.currentSound.waveform_url);
          }
          $scope.currentSound.description = $sce.trustAsHtml(currentSound.description);
          $scope.playStatus = 'play';
        });
      });
    });
    $scope.player.bind(SC.Widget.Events.PAUSE, function ( ) {
      console.log('SC.PAUSE', arguments);
      $scope.$apply(function ( ) { $scope.playStatus = 'pause'; });
    });
    $scope.player.bind(SC.Widget.Events.FINISH, function ( ) {
      console.log('SC.FINISH', arguments);
      $scope.$apply(function ( ) { $scope.playStatus = 'finish'; });
    });
    $scope.player.bind(SC.Widget.Events.SEEK, function ( ) {
      console.log('SC.SEEK', arguments);
    });

    $scope.player.bind(SC.Widget.Events.LOAD_PROGRESS, function ( ) {
      console.log('SC.LOAD_PROGRESS', arguments);
    });
    $scope.player.bind(SC.Widget.Events.PLAY_PROGRESS, function (progress) {
      // too noisy console.log('SC.PLAY_PROGRESS', arguments);
      $scope.$apply(function ( ) {
        $scope.playProgress = progress;
      });
    });

    $scope.player.bind(SC.Widget.Events.CLICK_DOWNLOAD, function ( ) {
      console.log('SC.CLICK_DOWNLOAD', arguments);
    });
    $scope.player.bind(SC.Widget.Events.CLICK_BUY, function ( ) {
      console.log('SC.CLICK_BUY', arguments);
    });
    $scope.player.bind(SC.Widget.Events.OPEN_SHARE_PANEL, function ( ) {
      console.log('SC.OPEN_SHARE_PANEL', arguments);
    });
    $scope.player.bind(SC.Widget.Events.ERROR, function ( ) {
      console.log('SC.ERROR', arguments);
    });

    console.log('prototype.attachToPlayer', elementId, $scope.player);
  };
}

PrototypeCtrl.$inject = [
  '$scope',
  '$window',
  '$interval',
  '$sce'
];

angular.module('robcolbertApp')
.controller('PrototypeCtrl', PrototypeCtrl);
