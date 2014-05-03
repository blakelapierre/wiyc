// controllers/directives/soundcloud-player.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function PulsarSoundCloudPlayerCtrl ($scope, $interval, WebAudio, SoundCloud, PresentationEngine) {
  var self = this;
  var uiUpdateInterval = null;

  $scope.ready = false;
  $scope.audio = null;
  $scope.trackData = null;

  /*
   * Some sample URLs to get you started:
   * https://soundcloud.com/glitchhop/the-real-deal-by-illectrix
   * https://soundcloud.com/officialsnails/dirty-raxxx
   * https://soundcloud.com/mid-tempo/the-dealer-by-bro-safari-x-ufo
   * https://soundcloud.com/karluvklub/sixxx-free
   *
   * I use a watch on the URL so the current track can be switched. This is
   * engineered a little forward in expectation of SC playlist support as
   * well as playlists users build here on Pulsar with additional features.
   */

  $scope.soundUrl = null;
  $scope.$watch('soundUrl', function (oldValue, newValue) {
    SoundCloud
    .resolveUrl($scope.soundUrl)
    .success(function onResolveSuccess (urlData) {
      $scope.$apply(function ( ) {
        $scope.soundId = urlData.id;
        $scope.loadingMessage = 'loading metadata for sound ' + $scope.soundId.toString();
      });
      SoundCloud.loadTrackData(urlData.id, function (err, trackData) {
        if (trackData.kind !== 'track') {
          $scope.$emit('pulsarServiceError', {
            'data': {
              'message':'SoundCloud resource type not supported.',
              'errors': [
                {
                  'name':'Resource Not Supported',
                  'message':'SoundCloud resources of type "'+trackData.kind+'" are not supported by the Pulsar SoundCloud widget.'
                }
              ],
              'solutions': [
                {
                  'name':'Edit SoundCloud Embed',
                  'message':'Edit the SoundCloud embed in this pulse and fix the URL of the track to embed.'
                }
              ]
            }
          });
          return;
        }
        $scope.loadingMessage = 'buffering network audio stream...';
        $scope.trackData = trackData;
        $scope.audioDurationLabel = moment(0).utc().milliseconds(trackData.duration).format('HH:mm:ss');
        $scope.audio = new Audio();
        $scope.audio.src = SoundCloud.blessUrl(trackData.stream_url); // jshint ignore:line
        $scope.audio.load();
        $scope.audio.addEventListener('canplay', function ( ) {
          $scope.$apply(function ( ) {
            $scope.source = WebAudio.createMediaElementSource($scope.audio);
            $scope.ready = true;
          });
        });
      });
    })
    .error(function onResolveError (urlError) {
      console.log('SoundCloud resolve error', $scope.soundUrl, urlError);
    });
  });

  $scope.loadingMessage = 'initializing...';

  $scope.$on('$routeChangeStart', function ( ) {
    $scope.stopSound();
  });

  $scope.calendarMoment = function (date) {
    return moment(date).fromNow();
  };

  function updateAudioEngine ( ) {
    var ratio;

    WebAudio.update();

    ratio = $scope.audio.currentTime / $scope.audio.duration;
    $scope.visualizer.progressBar.css('width', (ratio * 100.0) + '%');
    $scope.audioTimeLabel = moment(0).utc().seconds($scope.audio.currentTime).format('HH:mm:ss');
  }

  $scope.keepUpdating = false;
  function update ( ) {
    if ($scope.keepUpdating) {
      requestAnimationFrame(update);
    }

    updateAudioEngine();
    $scope.visualizer.update();
  }

  function startUiUpdates ( ) {
    $scope.keepUpdating = true;
    $scope.visualizer.player.addClass('active');
    update();
  }

  function stopUiUpdates ( ) {
    $scope.keepUpdating = false;
    $scope.visualizer.player.css('background-color', $scope.visualizer.playerOriginalBgColor);
    $scope.visualizer.player.removeClass('active');
  }

  $scope.audioState = 'stopped';
  $scope.playSound = function ( ) {
    switch ($scope.audioState) {
      case 'stopped':
        $scope.audio.play();
        $scope.audioState = 'playing';
        startUiUpdates();
        break;
      case 'paused':
        $scope.audio.play();
        $scope.isPlaying = true;
        $scope.audioState = 'playing';
        break;
      case 'playing':
        $scope.audio.pause();
        $scope.audioState = 'paused';
        break;
    }
  };

  $scope.pauseSound = function ( ) {
    if ($scope.audioState === 'paused') {
      return;
    }
    $scope.audio.pause();
    $scope.autioState = 'paused';
    stopUiUpdates();
  };

  $scope.stopSound = function ( ) {
    $scope.audio.pause();
    $scope.audio.currentTime = 0.0; // rewind
    $scope.audioState = 'stopped';
    stopUiUpdates();
  };

  $scope.toggleFullscreen = function ( ) {
    if (PresentationEngine.isFullscreen()) {
      $scope.visualizer.widget.removeClass('full-screen');
      PresentationEngine.exitFullscreen();
      $scope.isFullscreen = false;
      return;
    }
    PresentationEngine.requestFullscreen($scope.visualizer.widget[0]);
    $scope.visualizer.widget.addClass('full-screen');
    $scope.isFullscreen = true;
  };

}

PulsarSoundCloudPlayerCtrl.$inject = [
  '$scope',
  '$interval',
  'WebAudio',
  'SoundCloud',
  'PresentationEngine'
];

angular.module('pulsarClientApp')
.controller('PulsarSoundCloudPlayerCtrl', PulsarSoundCloudPlayerCtrl);
