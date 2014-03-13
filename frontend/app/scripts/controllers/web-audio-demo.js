// -----------------------------------------------------------------------------
// FILE
//
//  controllers/web-audio-demo.js
//
// PURPOSE
//
//  Implement the AngularJS controller logic for the #/web-audio-demo route by
//  integrating the SoundCloud service and the WebAudio service (both Pulsar
//  components) into one highly visual presentation using the Pulsar
//  presentation engine HTML protocol. Not sure if that makes sense. Feedback
//  is appreciated even down at this level (the source).
//
// -----------------------------------------------------------------------------
//
// LICENSE
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//
// -----------------------------------------------------------------------------

'use strict';
/* global $:false */

function WebAudioDemoCtrl ($scope, $window, $interval, $sce, WebAudio, SoundCloud) {

  var self = this;
  var canvasContext = document.getElementById('visualizer').getContext('2d');

  function YouTubeVideo (elementId, videoId) {

    var self = this;

    self.player = new $window.YT.Player(elementId, {
      'height': '390',
      'width': '640',
      'videoId': videoId,
      'playerVars': {
        'controls': 0,
        'modestbranding': 1,
        'playsinline': 0 /* full-screen on iProducts, please */,
        'showinfo': 0
      },
      'events': {
        'onReady': function onReady ( ) {
          console.log('YouTube video', elementId, 'is ready');
        }
      }
    });

    return self.player;
  }

  function updateUI ( ) {
    var width = 1024;
    var height = 128;

    var ratio = $scope.audio.currentTime / $scope.audio.duration;
    $('#progressBar').css('width', (ratio * 100.0) + '%');

    WebAudio.updateFrequencyAnalysis();
    WebAudio.updateTimeAnalysis();
    canvasContext.beginPath();
    canvasContext.clearRect(0, 0, width, height);
    canvasContext.fillStyle = 'rgba(255,0,0,0.6)';
    canvasContext.lineCap = 'round';
    canvasContext.fill();
    for(var i = 0; i < WebAudio.analyser.frequencyBinCount; ++i ) {
      canvasContext.fillRect(i, height, 1, -(WebAudio.freqByteData[i] / 4.0));
    }
  }

  $scope.ready = false;

  SoundCloud.loadTrackData('138892123', function (err, trackData) {
    console.log('SoundCloud track data', trackData);
    $scope.trackData = trackData;
    $scope.audio = new Audio();
    $scope.audio.addEventListener('canplay', function ( ) {
      $scope.source = WebAudio.createMediaElementSource($scope.audio);
      $scope.youtubeVideo1 = new YouTubeVideo('youtubeVideo1', '1UjEVnmXL0o');
      $scope.youtubeVideo1.addEventListener('onStateChange', function (newState) {
        if ($scope.videoUpdateIntervalId !== null) {
          clearInterval($scope.videoUpdateIntervalId);
          $scope.videoUpdateIntervalId = null;
        }
        $scope.$apply(function ( ) {
          self.state = newState.data;
          switch (self.state) {
            case -1:
              self.stateLabel = '';
              break;
            case 0:
              self.stateLabel = 'end';
              ga('send', 'event', 'Videos', 'videoFinished', 1);
              break;
            case 1:
              self.stateLabel = 'play';
              $scope.audio.play();
              intervalPromise = $interval(updateUI, 1000.0 / 30.0);
              break;
            case 2:
              self.stateLabel = 'pause';
              $scope.audio.pause();
              if (intervalPromise !== null) {
                $interval.cancel(intervalPromise);
                intervalPromise = null;
              }
              break;
            case 3:
              self.stateLabel = 'buffer';
              break;
            case 4:
              self.stateLabel = 'cued';
              break;
          }
        });
      });
      $scope.ready = true;
    });

    $scope.audio.src = SoundCloud.blessUrl(trackData.stream_url); // jshint ignore:line
    $scope.audio.load();
  });

  var intervalPromise = null;

  $scope.play = function ( ) {
    if ($scope.audio === null) { return; }
    $scope.youtubeVideo1.playVideo();
    $scope.youtubeVideo1.setVolume(0);
  };

  $scope.stop = function ( ) {
    if ($scope.audio === null) { return; }
  };

}

WebAudioDemoCtrl.$inject = [
  '$scope',
  '$window',
  '$interval',
  '$sce',
  'WebAudio',
  'SoundCloud'
];

angular.module('robcolbertApp')
.controller('WebAudioDemoCtrl', WebAudioDemoCtrl);
