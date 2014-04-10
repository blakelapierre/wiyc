// controllers/directives/soundcloud-player.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

/*
 * The controller accesses $element to retrieve its attributes. That is all.
 * Attribute values on the element are used to pass the soundId forward to the
 * controller. Yes, there are different ways of doing this. I'm exploring this
 * one as a maintainability test.
 */

function PulsarSoundCloudPlayerCtrl ($element, $scope, $interval, WebAudio, SoundCloud, PresentationEngine) {
  var self = this;
  var container = $element;
  var widget = container.find('.pulsar-widget');
  var player = container.find('.soundcloud-player');
  var progressBar = container.find('.progress-bar');
  var visualizer = container.find('.visualizer');
  var game = container.find('.game-canvas');
  var uiUpdateInterval = null;

  var playerOriginalBgColor = player.css('background-color');

  $scope.ready = false;
  $scope.audio = null;
  $scope.trackData = null;

  /*
   * Some sample URLs to get you started:
   * https://soundcloud.com/glitchhop/the-real-deal-by-illectrix
   * https://soundcloud.com/officialsnails/dirty-raxxx
   * https://soundcloud.com/mid-tempo/the-dealer-by-bro-safari-x-ufo
   * https://soundcloud.com/karluvklub/sixxx-free
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
        console.log('SoundCloud trackData', trackData);
        if (trackData.kind !== 'track') {
          $scope.$emit('setServiceError', {
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
          console.log('THREEjs stuff', $scope.scene, $scope.camera, $scope.renderer);
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
  $scope.soundUrl = $element.attr('data-sound-url');

  //container.find('.idle-hide').hide();

  progressBar.css('background-color', 'rgb(96,192,255)');
  visualizer.css('background-color', 'rgb(16,48,64)');
  angular.element('.progress-container').css('background-color', 'rgb(16,48,64)');

  $scope.$on('$routeChangeStart', function ( ) {
    $scope.stopSound();
  });

  $scope.toggleFullscreen = function ( ) {
    if (PresentationEngine.isFullscreen()) {
      widget.removeClass('full-screen');
      PresentationEngine.exitFullscreen();
      $scope.isFullscreen = false;
      return;
    }
    PresentationEngine.requestFullscreen(widget[0]);
    widget.addClass('full-screen');
    $scope.isFullscreen = true;
  };

  $scope.calendarMoment = function (date) {
    return moment(date).fromNow();
  };

  function updateAudioEngine ( ) {
    var ratio = $scope.audio.currentTime / $scope.audio.duration;
    progressBar.css('width', (ratio * 100.0) + '%');
    WebAudio.updateFrequencyAnalysis();
    WebAudio.updateTimeAnalysis();
    $scope.audioTimeLabel = moment(0).utc().seconds($scope.audio.currentTime).format('HH:mm:ss');
  }

  function updateVisualizer ( ) {
    var ctx = visualizer[0].getContext('2d');
    var ctxWidth = ctx.canvas.width;
    var ctxHeight = ctx.canvas.height;

    ctx.lineCap = 'round';
    ctx.clearRect(0, 0, ctxWidth, ctxHeight)

    var graphH = 64.0;
    var drawX, drawY;
    var power;

    var bassAvg = 0.0;
    var midsAvg = 0.0;
    var trebAvg = 0.0;

    function renderFrequencyBar (x, power) {
      var barH = graphH * (WebAudio.freqByteData[idx] / 256.0);
      ctx.fillRect(idx, graphH, 1, -barH);
    }

    var idx = 0;
    var bassCutoff = 80;
    var midsCutoff = 256;
    var trebCutoff = 768;

    ctx.fillStyle = 'rgb(220,0,0)';
    for ( ; idx < bassCutoff; ++idx) {
      power = WebAudio.freqByteData[idx];
      bassAvg += power;
      renderFrequencyBar(idx, power);
    }
    bassAvg = parseInt(bassAvg / bassCutoff);

    ctx.fillStyle = 'rgb(0,220,0)';
    for ( ; idx < midsCutoff; ++idx) {
      power = WebAudio.freqByteData[idx];
      midsAvg += power;
      renderFrequencyBar(idx, power);
    }
    midsAvg = parseInt(midsAvg / (midsCutoff - bassCutoff));

    ctx.fillStyle = 'rgb(0,0,220)';
    for ( ; idx < trebCutoff; ++idx) {
      power = WebAudio.freqByteData[idx];
      trebAvg += power;
      renderFrequencyBar(idx, power);
    }
    trebAvg = parseInt(trebAvg / (trebCutoff - midsCutoff));

    var audioColor = 'rgb('+bassAvg+','+midsAvg+','+trebAvg+')';

    var bassRatio = bassAvg / 255.0;
    var midsRatio = midsAvg / 255.0;
    var trebRatio = trebAvg / 255.0;
    var specRatio = (bassRatio + midsRatio + trebRatio) / 3.0;
    $scope.updateVisualizer3d(specRatio, bassRatio, midsRatio, trebRatio);

    if (!PresentationEngine.isFullscreen()) {
      player.css('background-color', audioColor);
    } else {
      player.css('background-color', 'black');
    }

    drawX = trebCutoff;
    ctx.fillStyle = audioColor;
    for(var idx = 0; idx < 256; ++idx ) {
      drawY = WebAudio.timeByteData[idx * 4] / 4.0;
      ctx.fillRect(drawX++, drawY, 2, 2);
    }

    ctx.fillStyle = 'rgb(24,48,96)';
    ctx.fillRect(768,0,3,64);
  }

  $scope.keepUpdating = false;
  $scope.skipUpdate = false;
  function update ( ) {
    if ($scope.keepUpdating) {
      requestAnimationFrame(update);
    }
//     $scope.skipUpdate = !($scope.skipUpdate);
//     if ($scope.skipUpdate) {
//       return;
//     }

    updateAudioEngine();
    updateVisualizer();
  }

  function startUiUpdateInterval ( ) {
    $scope.keepUpdating = true;
    player.addClass('active');
    update();
  }

  function stopUiUpdateInterval ( ) {
    $scope.keepUpdating = false;
    player.css('background-color', playerOriginalBgColor);
    player.removeClass('active');
  }

  $scope.audioState = 'stopped';
  $scope.playSound = function ( ) {
    switch ($scope.audioState) {
      case 'stopped':
        $scope.audio.play();
        $scope.audioState = 'playing';
        startUiUpdateInterval();
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
    if (!$scope.isPlaying) {
    } else {
    }
  };

  $scope.pauseSound = function ( ) {
    $scope.audio.pause();
    stopUiUpdateInterval();
  };

  $scope.stopSound = function ( ) {
    $scope.audio.pause();
    $scope.audio.currentTime = 0.0; // rewind
    stopUiUpdateInterval();
  };

}

PulsarSoundCloudPlayerCtrl.$inject = [
  '$element',
  '$scope',
  '$interval',
  'WebAudio',
  'SoundCloud',
  'PresentationEngine'
];

angular.module('pulsarClientApp')
.controller('PulsarSoundCloudPlayerCtrl', PulsarSoundCloudPlayerCtrl);
