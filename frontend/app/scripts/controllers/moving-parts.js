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

function MovingPartsCtrl ($scope, $window, $interval, $sce, WebAudio, SoundCloud, Configuration) {

  var self = this;

  var gameContext = document.getElementById('gameCanvas').getContext('2d');
  var gameContextWidth = gameContext.canvas.width;
  var gameContextHeight = gameContext.canvas.height;

  var gameInfoContext = document.getElementById('gameInfoCanvas').getContext('2d');
  var gameInfoContextWidth = gameInfoContext.canvas.width;
  var gameInfoContextHeight = gameInfoContext.canvas.height;

  var gameEvent, gameTime;
  var width, height;
  var barH = 0, boxH = 48.0;

  $scope.ready = false;
  $scope.$emit('setPageGroup', 'demos');
  ga('send', 'pageview');

  var titleCard = $('#titleCard');
  $scope.titleCard = {
    'title':'MOVING PARTS',
    'description':'An Experience Powered by PULSAR'
  };

  var promptCard = $('#promptCard');
  promptCard.hide();
  $scope.promptCard = {
    'prompt':''
  };

  $scope.gameData = {
    'player': {
      'lives': 3,
      'score': 0,
      'flags': {
        'safeKicked': false,
        'bossDrone': {
          'attack1': false
        }
      }
    },
    'mouse': { 'x': 0, 'y': 0 },
    'targetZones': [ ]
  };
  $scope.gameEvents = [ ];

  $('.no-theater').hide();
  $('.sidebar').fadeOut(1000, function ( ) {
    $('.sidebar').removeClass('col-sm-4');
    $('.main-view').removeClass('col-sm-8').addClass('col-sm-12');
  }); // .no-theater fadeOut

  function YouTubeVideo (elementId, videoId) {
    var self = this;
    self.player = new $window.YT.Player(elementId, {
      'height': '390',
      'width': '640',
      'playerVars': {
        'origin': Configuration.getFrontEndHost(),
        'html5': 1,
        'controls': 0,
        'disablekb': 1,
        'enablejsapi': 1,
        'modestbranding': 1,
        'playsinline': 0 /* full-screen on iProducts, please */,
        'fs':0,             // no full-screen button
        'iv_load_policy':3, // no annotations
        'showinfo': 0       // don't show info
      },
      'events': {
        'onReady': function onReady ( ) {
          console.log('YouTube video', elementId, 'is ready');
          self.player.loadVideoById(videoId);
        }
      }
    });
    return self.player;
  }

  function updateEvents ( ) {
    gameTime = $scope.audio.currentTime;
    gameEvent = $scope.gameEvents[0];
    if (angular.isDefined(gameEvent)) {
      $scope.nextEventLabel = gameEvent.title;
      $scope.nextEventTimer = (gameEvent.offset - gameTime).toFixed(2);
    }
    while (($scope.gameEvents.length > 0) && (gameTime >= $scope.gameEvents[0].offset)) {
      $scope.gameEvents[0].callback();
      $scope.gameEvents.shift();
    }
  }

  function updateAudioEngine ( ) {
    var ratio = $scope.audio.currentTime / $scope.audio.duration;
    $('#progressBar').css('width', (ratio * 100.0) + '%');
    WebAudio.updateFrequencyAnalysis();
    WebAudio.updateTimeAnalysis();
  }

  function updateGameInfo ( ) {
    width = gameInfoContext.canvas.width;
    height = gameInfoContext.canvas.height;

    gameInfoContext.beginPath();
    gameInfoContext.clearRect(0, 0, width, height);

    gameInfoContext.fillStyle = '#ffffff';
    gameInfoContext.fillRect(0, 0, width, boxH);

    gameInfoContext.fillStyle = 'rgba(255, 0, 0, 0.6)';
    gameInfoContext.lineCap = 'round';
    for(var i = 0; i < width; ++i ) {
      barH = boxH * (WebAudio.freqByteData[i] / 256.0);
      gameInfoContext.fillRect(i, boxH, 1, -barH);
    }
  }

  function renderTargetZones ( ) {
    var oldFillStyle = gameContext.fillStyle;
    gameContext.fillStyle = 'rgba(0,255,0,0.5)';
    $scope.gameData.targetZones.forEach(function (zone) {
      gameContext.fillRect(
        width * zone.x,
        height * zone.y,
        width * zone.width,
        height * zone.height
      );
      gameContext.fillStyle = 'rgba(255,255,255,0.25)';
    });
    gameContext.fillStyle = oldFillStyle;
  }

  function updateGameOverlay ( ) {
    width = gameContext.canvas.width;
    height = gameContext.canvas.height;

    gameContext.clearRect(0,0,width,height);
    renderTargetZones();
  }

  function updateUI ( ) {
    updateEvents();
    updateAudioEngine();
    updateGameInfo();
    updateGameOverlay();
  }

  SoundCloud.loadTrackData('138892123', function (err, trackData) {
    var firstPlay = true;

    console.log('SoundCloud track data', trackData);
    $scope.trackData = trackData;

    $scope.audio = new Audio();
    $scope.audio.src = SoundCloud.blessUrl(trackData.stream_url); // jshint ignore:line
    $scope.audio.load();
    $scope.audio.addEventListener('canplay', function ( ) {
      $scope.source = WebAudio.createMediaElementSource($scope.audio);
    });

    $scope.youtubeVideo1 = new YouTubeVideo('youtubeVideo1', '1UjEVnmXL0o');
    $scope.youtubeVideo1.addEventListener('onStateChange', function (newState) {
      $scope.$apply(function ( ) {
        self.videoState = newState.data;
        switch (self.videoState) {
          case -1:
            $scope.videoStateLabel = '';
            break;
          case 0:
            $scope.videoStateLabel = 'ended';
            ga('send', 'event', 'Videos', 'videoFinished', 1);
            break;
          case 1:
            $scope.videoStateLabel = 'playing';
            if (firstPlay) {
              firstPlay = false;
              $scope.gameInit();
              $('#gameContainer').fadeIn(1000);
              $interval(updateUI, 1000.0 / 30.0);
            }
            $scope.audio.play();
            break;
          case 2:
            $scope.videoStateLabel = 'paused';
            $scope.audio.pause();
            break;
          case 3:
            $scope.videoStateLabel = 'buffering';
            break;
          case 4:
            $scope.videoStateLabel = 'cued';
            break;
        }
      });
    });
    $scope.ready = true;
  });

  $scope.play = function ( ) {
    if ($scope.audio === null) { return; }
    $scope.youtubeVideo1.playVideo();
  };

  $scope.stop = function ( ) {
    if ($scope.audio === null) { return; }
  };

  $scope.pause = function ( ) {
    switch (self.videoState) {
      case YT.PlayerState.PLAYING:
        $scope.youtubeVideo1.pauseVideo();
        break;
      case YT.PlayerState.PAUSED:
        $scope.youtubeVideo1.playVideo();
        break;
    }
  };

  $scope.jump = function ( ) {
    var time = parseFloat($scope.newAudioTime);
    $scope.gameInit();
    $scope.audio.currentTime = time;
  };

  function showPrompt (message) {
    $scope.promptCard.prompt = message;
    promptCard.fadeIn(250);
  }

  function hidePrompt ( ) {
    promptCard.fadeOut(100);
  }

  $scope.indicatorZone = { 'x':0, 'y':0, 'width':0, 'height':0 };
  $scope.gameData.targetZones.push($scope.indicatorZone);

  $scope.onMouseMove = function ($event) {
    $scope.gameData.mouse.x = $event.offsetX;
    $scope.gameData.mouse.ratioX = ($event.offsetX / $event.target.clientWidth).toFixed(3);
    $scope.gameData.mouse.y = $event.offsetY;
    $scope.gameData.mouse.ratioY = ($event.offsetY / $event.target.clientHeight).toFixed(3);

    $scope.indicatorZone.width = ($scope.gameData.mouse.ratioX - $scope.indicatorZone.x).toFixed(3);
    $scope.indicatorZone.height = ($scope.gameData.mouse.ratioY - $scope.indicatorZone.y).toFixed(3);
  };

  var ratioX, ratioY, idx, zone;

  $scope.onMouseDown = function ($event) {
    console.log('onMouseDown', $event, $scope.indicatorZone);
    ratioX = $event.offsetX / $event.target.clientWidth;
    ratioY = $event.offsetY / $event.target.clientHeight;
    $scope.indicatorZone.x = ratioX.toFixed(3);
    $scope.indicatorZone.y = ratioY.toFixed(3);

    for (idx = $scope.gameData.targetZones.length - 1; idx >= 0; --idx) {
      zone = $scope.gameData.targetZones[idx];
      if ((ratioX >= zone.x) && (ratioY >= zone.y) && (ratioX <= (zone.x + zone.width)) && (ratioY <= (zone.y + zone.height))) {
        if (!zone.callback()) {
          $scope.gameData.targetZones.splice(idx, 1);
        }
      }
    }
  };

  $scope.onMouseUp = function ($event) {
    //console.log('onMouseUp', $event);
  };

  $scope.onKeyDown = function ($event) {
    console.log('onKeyDown', $event);
  };

  $scope.onKeyUp = function ($event) {
    console.log('onKeyUp', $event);
  };

  $scope.gameOver = function (message) {
    $scope.youtubeVideo1.pauseVideo();
    $scope.titleCard.title = 'GAME OVER';
    $scope.titleCard.description = message;
    titleCard.fadeIn(1000);
  };

  $scope.gameInit = function ( ) {
    $scope.gameEvents = [ ];

    $scope.gameEvents.push({    /* MUTE VIDEO AUDIO */
      'title':'MOVING PARTS - Powered by Pulsar',
      'offset': 2.0,
      'callback': function ( ) {
        console.log('System Startup event has fired');
        $scope.youtubeVideo1.setVolume(0);
      }
    });

    $scope.gameEvents.push({    /* FADE OUT TITLE CARD */
      'title':'MOVING PARTS - Powered by Pulsar',
      'offset': 5,
      'callback': function ( ) {
        titleCard.fadeOut(1500);
      }
    });

    $scope.gameEvents.push({    /* HAVEN AUTOSYSTEMS BUILDING */
      'title':'Your Participation is REQUIRED',
      'offset':13.64,
      'callback': function ( ) {
        $scope.youtubeVideo1.seekTo(42.5);
      }
    });

    $scope.gameEvents.push({    /* Hero approaches box */
      'title':'Our Hero Needs Your Help...',
      'offset':27.647,
      'callback': function ( ) {
        $scope.youtubeVideo1.seekTo(68);
      }
    });

    $scope.gameEvents.push({
      'title':'KICK THE VAULT!!',
      'offset':29.0,
      'callback': function ( ) {
        var vaultHitsLeft = 3;
        $scope.gameData.player.flags.safeKicked = false;
        $scope.gameData.targetZones.push({
          'x':0.196,
          'y':0.517,
          'width':0.233,
          'height':0.361,
          'callback': function ( ) {
            if (--vaultHitsLeft > 0) {
              $scope.gameData.score += 50;
              return true;
            }
            $scope.gameData.player.flags.safeKicked = true;
            hidePrompt();
          }
        });
        showPrompt('CLICK/TAP THE VAULT!!');
      }
    });

    $scope.gameEvents.push({
      'title':'KICK THE VAULT!!',
      'offset':32.0,
      'callback': function ( ) {
        if (!$scope.gameData.player.flags.safeKicked) {
          hidePrompt();
          $scope.gameData.targetZones = [ ];
          $scope.gameOver('You failed to kick (click) the vault in time.');
        }
      }
    });

    $scope.gameEvents.push({
      'title':'Watch For Actions to Perform...',
      'offset':40.00,
      'callback': function ( ) {
      }
    });

    $scope.gameEvents.push({
      'title':'PREPARE FOR COMBAT!!',
      'offset':65.00,
      'callback': function ( ) {
        $scope.titleCard.title = 'ENEMY INCOMING!';
        $scope.titleCard.description = 'tap screen to give hero commands';
        titleCard.fadeIn(500);
      }
    });

    $scope.gameEvents.push({
      'title':'GAME PLAY BEGINS!!',
      'offset':68.870,
      'callback': function ( ) {
        $scope.youtubeVideo1.seekTo(119.000);
        titleCard.fadeOut(200);
      }
    });

    $scope.gameEvents.push({
      'title':'SHOOT THE DRONE!',
      'offset':72.200,
      'callback': function ( ) {
        var engineHitsLeft = 3;
        showPrompt('SHOOT THE DRONE\'S ENGINE!!');
        $scope.gameData.targetZones.push({
          'x':0,
          'y':0,
          'width':0,
          'height':0,
          'callback':function ( ) {
            if (--engineHitsLeft > 0) {
              $scope.gameData.score += 200;
              return true;
            }
            $scope.gameData.player.flags.bossDrone.attack1 = true;
            hidePrompt();
            return false;
          }
        });
      }
    });

    $scope.gameEvents.push({
      'title':'JUMP THE WALL!',
      'offset':75.716,
      'callback': function ( ) {
        $scope.youtubeVideo1.seekTo(130);
      }
    });

    $scope.gameEvents.push({
      'title':'BOSS DRONE ATTACK STAGE 1',
      'offset':86,
      'callback': function ( ) {
        $scope.youtubeVideo1.setVolume(100);
        WebAudio.gain.gain.value = 0.25;
      }
    });

    $scope.gameEvents.push({        /* BEGIN LIVE ACTION */
      'title':'PREPARE TO ENGAGE ENEMY!',
      'offset':95.0737,
      'callback': function ( ) {
        $scope.youtubeVideo1.setVolume(0);
        WebAudio.gain.gain.value = 0.6; // music stays ducked for SFX
      }
    });

    $scope.gameEvents.push({
      'title':'RIDE FOR YOUR LIFE!!',
      'offset':122.88,
      'callback': function ( ) {
        $scope.titleCard.title = 'DEFEAT THE MINI-DRONES';
        $scope.titleCard.description = 'Release flares and detonate them with taps';
        WebAudio.gain.gain.value = 1.0;
        titleCard.fadeIn(200);
      }
    });

    $scope.gameEvents.push({      /* DUCK MUSIC FOR WHEELIE SCENE */
      'title':'(audio program mixer settings)',
      'offset':129,
      'callback': function ( ) {
        titleCard.fadeOut(200);
        $scope.youtubeVideo1.setVolume(100);
        WebAudio.gain.gain.value = 0.4;
      }
    });

    $scope.gameEvents.push({      /* RESTORE MUSIC SPL */
      'title':'(audio program mixer settings)',
      'offset':140,
      'callback': function ( ) {
        titleCard.fadeOut(200);
        $scope.youtubeVideo1.setVolume(0);
        WebAudio.gain.gain.value = 0.6; // remain semi-ducked for SFX
      }
    });
  };

}

MovingPartsCtrl.$inject = [
  '$scope',
  '$window',
  '$interval',
  '$sce',
  'WebAudio',
  'SoundCloud',
  'Configuration'
];

angular.module('robcolbertApp')
.controller('MovingPartsCtrl', MovingPartsCtrl);
