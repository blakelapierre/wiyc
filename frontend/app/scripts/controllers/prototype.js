// controllers/prototype.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function PrototypeCtrl ($scope, $window, $interval, $sce) {

  $window.scrollTo(0, 0);
  $scope.$emit('setPageGroup', 'demos');
  ga('send', 'pageview');

  $scope.ready = false;
  $scope.started = false;
  $scope.cp = 0;

  $scope.bpm = 174;
  $scope.millsPerBeat = Math.round((60.0 / $scope.bpm) * 1000.0);

  $scope.launchExperience = function ( ) {
    ga('send','event', 'SoundCloudPrototype', 'launched', 1);
    $scope.started = true;
    $scope.player.play();
  };

  $scope.attachToPlayer = function (elementId) {

    $scope.playerState = 'startup';
    $scope.player = window.SC.Widget(elementId);
    $scope.currentSound = null;
    $scope.playProgress = null;

    console.log('window.SC', window.SC);
    if (window.SC) {
      $scope.ready = true;
      $scope.playerState = 'ready';
    }

    $scope.$watch('playProgress', function ( ) {
      if ($scope.playProgress === null) {
        return;
      }
      $scope.cp = $scope.playProgress.currentPosition; // it's used EVERYWHERE

      var startTime = 25360.0;
      var timeSpan = 66000.0 - startTime;
      var blendRatio = 1.0 - (($scope.cp - startTime) / timeSpan);

      jQuery('#waveformImage').css('left', -8192 * ($scope.cp / $scope.durationMills));
      jQuery('#waveformImage').css('background-color', 'rgba(0,0,0,' + blendRatio + ')');

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

    $scope.player.bind(SC.Widget.Events.READY, function ( ) {
      console.log('SC.READY', JSON.stringify(arguments));
      $scope.ready = true;
      $scope.playerState = 'ready';
    });

    $scope.player.bind(SC.Widget.Events.PLAY, function ( ) {
      console.log('SC.PLAY', arguments);
      ga('send','event', 'SoundCloudPrototype', 'player.play', 1);
      $scope.state = 'playing';
      $scope.player.getDuration(function (durationMills) {
        console.log('track duration (mills)', durationMills);
        $scope.durationMills = durationMills;
      });

      // In the following, you're going to see some jshint ignore:line
      // directives. The SoundCloud Widget API is not my code. I can't
      // help that they don't use camelCase identifiers, but I do and
      // it's my standard.

      $scope.player.getCurrentSound(function (currentSound) {
        console.log('currentSound', currentSound);
        $scope.$apply(function ( ) {
          $scope.started = true;
          $scope.currentSound = currentSound;
          if (currentSound.downloadable) {
            $scope.currentSound.download_url = $sce.trustAsUrl(currentSound.download_url); // jshint ignore:line
          }
          if ($scope.currentSound.purchase_url) {  // jshint ignore:line
            $scope.currentSound.purchase_url = $sce.trustAsUrl(currentSound.purchase_url);  // jshint ignore:line
          }
          if ($scope.currentSound.waveform_url) {  // jshint ignore:line
            $scope.currentSound.waveform_url = $sce.trustAsUrl($scope.currentSound.waveform_url);  // jshint ignore:line
          }
          $scope.currentSound.description = $sce.trustAsHtml(currentSound.description);
          $scope.playStatus = 'play';
        });
      });
    });

    $scope.player.bind(SC.Widget.Events.PAUSE, function ( ) {
      console.log('SC.PAUSE', arguments);
      ga('send','event', 'SoundCloudPrototype', 'player.paused', 1);
      $scope.state = 'paused';
      $scope.$apply(function ( ) { $scope.playStatus = 'pause'; });
    });

    $scope.player.bind(SC.Widget.Events.FINISH, function ( ) {
      console.log('SC.FINISH', arguments);
      ga('send','event', 'SoundCloudPrototype', 'player.finished', 1);
      $scope.state = 'finished';
      $scope.$apply(function ( ) { $scope.playStatus = 'finish'; });
    });

    $scope.player.bind(SC.Widget.Events.SEEK, function ( ) {
      $scope.state = 'seeking';
      ga('send','event', 'SoundCloudPrototype', 'player.seeked', 1);
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
      ga('send','event', 'SoundCloudPrototype', 'player.downloadClicked', 1);
    });

    $scope.player.bind(SC.Widget.Events.CLICK_BUY, function ( ) {
      console.log('SC.CLICK_BUY', arguments);
      ga('send','event', 'SoundCloudPrototype', 'player.buyClicked', 1);
    });

    $scope.player.bind(SC.Widget.Events.OPEN_SHARE_PANEL, function ( ) {
      console.log('SC.OPEN_SHARE_PANEL', arguments);
      ga('send','event', 'SoundCloudPrototype', 'player.shareClicked', 1);
    });

    $scope.player.bind(SC.Widget.Events.ERROR, function (error) {
      console.log('SC.ERROR', error);
      ga('send','event', 'SoundCloudPrototype', 'player.error', {'error':error});
      $scope.state = 'startup';
      $scope.error = error;
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
