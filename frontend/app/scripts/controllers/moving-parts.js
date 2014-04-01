// controllers/web-audio-demo.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';
/* global $:false */
/* global YT:false */

function MovingPartsCtrl (
  $scope,
  $window,
  $interval,
  $sce,
  PresentationEngine,
  WebAudio,
  SoundCloud,
  Configuration
) {

  var self = this;
  $('.idle-hide, .no-theater').hide();
  ga('send', 'pageview');

  var gameContext = document.getElementById('gameCanvas').getContext('2d');
  var gameContextWidth = gameContext.canvas.width;
  var gameContextHeight = gameContext.canvas.height;

  var gameInfoContext = document.getElementById('gameInfoCanvas').getContext('2d');
  var gameInfoContextWidth = gameInfoContext.canvas.width;
  var gameInfoContextHeight = gameInfoContext.canvas.height;

  var gameEvent, gameTime, isTimeJump = false, timeJumpTime = 0;
  var uiUpdateInterval = null;
  var barH = 0, boxH = 48.0;

  $scope.ready = false;
  $scope.currentViewMode = 'standard';

  $scope.$emit('setPageGroup', 'demos');
  $scope.$on('$routeChangeStart', function ( ) {
    $scope.stop();
  });

  var titleCard = $('#titleCard');
  $scope.titleCard = {
    'title':'MOVING PARTS',
    'description':'An Experience Powered by PULSAR<br/><small>created by: rob colbert</small>'
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

  function YouTubeVideo (elementId, videoId) {
    var self = this;
    self.player = new $window.YT.Player(elementId, {
      'height': '720',
      'width': '1280',
      'playerVars': {
        'origin': Configuration.getFrontEndHost(),
        'html5': 0,
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
          self.player.cueVideoById(videoId);
        }
      }
    });
    return self.player;
  }

  function updateEvents ( ) {
    var time;

    gameTime = $scope.audio.currentTime;
    gameEvent = $scope.gameEvents[0];

    if (angular.isDefined(gameEvent)) {
      time = gameEvent.offset - gameTime;
      if (time < 0.0) {
        time = 0.0;
      }
      $scope.nextEventTimer = time.toFixed(2);
    }
    if (gameTime < gameEvent.offset) {
      return;
    }
    if (gameTime > gameEvent.offset + 0.5) {
      $scope.gameEvents.shift(); // skip its callback, we're time-jumping
      return;
    }

    // leave the event at the head of the array until its callback returns
    // false (no more processing wanted)
    if (!$scope.gameEvents[0].callback()) {
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
    gameInfoContext.beginPath();
    gameInfoContext.clearRect(0, 0, gameInfoContextWidth, gameInfoContextHeight);
    gameInfoContext.fillStyle = '#dadada';//<-- sorry, that's just funny.
    gameInfoContext.lineCap = 'round';
    for(var i = 0; i < gameInfoContextWidth; ++i ) {
      barH = boxH * (WebAudio.freqByteData[i] / 256.0);
      gameInfoContext.fillRect(i, boxH, 1, -barH);
    }
  }

  function renderTargetZones ( ) {
    var oldFillStyle = gameContext.fillStyle;
    gameContext.fillStyle = 'rgba(0,255,0,0.5)';
    $scope.gameData.targetZones.forEach(function (zone) {
      gameContext.fillRect(
        gameContextWidth * zone.x,
        gameContextHeight * zone.y,
        gameContextWidth * zone.width,
        gameContextHeight * zone.height
      );
      gameContext.fillStyle = 'rgba(255,255,255,0.25)';
    });
    gameContext.fillStyle = oldFillStyle;
  }

  function updateGameOverlay ( ) {
    gameContext.clearRect(0, 0, gameContextWidth, gameContextHeight);
    renderTargetZones();
  }

  function updateUI ( ) {
    updateEvents();
    updateAudioEngine();
    updateGameInfo();
    updateGameOverlay();

    $scope.audioTimeLabel = $scope.audio.currentTime.toFixed(2);
    $scope.videoTimeLabel = $scope.youtubeVideo1.getCurrentTime().toFixed(2);
  }

  $scope.play = function ( ) {
    if ($scope.audio === null) { return; }
    $scope.youtubeVideo1.playVideo();
  };

  $scope.stop = function ( ) {
    if ($scope.audio === null) { return; }
    PresentationEngine.setDisplayMode(PresentationEngine.DisplayModes.STANDARD);
    $scope.audio.pause();
    $scope.audio.currentTime = 0.0; // rewind
    $scope.youtubeVideo1.seekTo(0.0);
    $scope.youtubeVideo1.stopVideo();
  };

  self.videoState = -2; // Pulsar value meaning, "No video loaded, yet"
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
    titleCard.fadeOut(250);
    promptCard.fadeOut(250);
    timeJumpTime = parseFloat($scope.newAudioTime);
    isTimeJump = true;
    if (timeJumpTime < $scope.audio.currentTime) {
      // rewind the whole gameplay stack for a backwards seek
      $scope.gameInit();
    }
    $scope.audio.currentTime = timeJumpTime;
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
  var mouseDown = false;
  var ratioX, ratioY, idx, zone;

  $scope.onMouseMove = function ($event) {
    $scope.gameData.mouse.x = $event.offsetX;
    $scope.gameData.mouse.ratioX = ($event.offsetX / $event.target.clientWidth).toFixed(3);
    $scope.gameData.mouse.y = $event.offsetY;
    $scope.gameData.mouse.ratioY = ($event.offsetY / $event.target.clientHeight).toFixed(3);
    if (mouseDown) {
      $scope.indicatorZone.width = ($scope.gameData.mouse.ratioX - $scope.indicatorZone.x).toFixed(3);
      $scope.indicatorZone.height = ($scope.gameData.mouse.ratioY - $scope.indicatorZone.y).toFixed(3);
    }
    $event.stopPropagation();
  };

  $scope.onMouseDown = function ($event) {
    mouseDown = true;
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

    $event.stopPropagation();
    return false;
  };

  $scope.onMouseUp = function ($event) {
    //console.log('onMouseUp', $event);
    mouseDown = false;
    $event.stopPropagation();
  };

  $scope.onKeyDown = function ($event) {
    console.log('onKeyDown', $event);
    $event.stopPropagation();
  };

  $scope.onKeyUp = function ($event) {
    console.log('onKeyUp', $event);
    $event.stopPropagation();
  };

  $scope.gameOver = function (message) {
    if (!isTimeJump) {
      $scope.youtubeVideo1.pauseVideo();
    }

    $scope.titleCard.title = 'EXPERIENCE TERMINATED';
    $scope.titleCard.description = message;

    if (!isTimeJump) {
      titleCard.fadeIn(1000);
    }
  };

  $scope.gameInit = function ( ) {
    $scope.gameEvents = [ ];

    $scope.gameEvents.push({    /* MUTE VIDEO AUDIO */
      'offset': 2.0,
      'callback': function ( ) {
        $scope.youtubeVideo1.setVolume(0);
        return false;
      }
    });

    $scope.gameEvents.push({    /* FADE OUT TITLE CARD */
      'offset': 5,
      'callback': function ( ) {
        titleCard.fadeOut(1500);
        return false;
      }
    });

    $scope.gameEvents.push({    /* HAVEN AUTOSYSTEMS BUILDING */
      'offset':13.64,
      'callback': function ( ) {
        if (this.offset > timeJumpTime) {
          $scope.youtubeVideo1.seekTo(42.5);
        }
        return false;
      }
    });

    $scope.gameEvents.push({
      'offset':20.800,
      'callback':function ( ) {
        $('#engineStatus').fadeIn(1000.0);
        return false;
      }
    });

    $scope.gameEvents.push({        // HERO APPROACHES BOX
      'offset':27.647,
      'callback': function ( ) {
        $scope.youtubeVideo1.seekTo(68);
        return false;
      }
    });

    $scope.gameEvents.push({        // KICK THE VAULT!!
      'title':'',
      'offset':28.0,
      'callback': function ( ) {
        showPrompt('CLICK/TAP THE VAULT!!');
        return false;
      }
    });

    $scope.gameEvents.push({        // KICK THE VAULT!!
      'title':'',
      'offset':30.0,
      'callback': function ( ) {
        var vaultHitsLeft = 3;
        $scope.gameData.player.flags.safeKicked = false;
        $scope.gameData.targetZones.push({
          'x':0.196,
          'y':0.517,
          'width':0.233,
          'height':0.361,
          'callback': function ( ) {
            hidePrompt();
            if (--vaultHitsLeft > 0) {
              $scope.gameData.score += 50;
              return true;
            }
            $scope.gameData.player.flags.safeKicked = true;
            return false;
          }
        });
        return false;
      }
    });

    $scope.gameEvents.push({
      'title':'KICK THE VAULT!!',
      'offset':32.0,
      'callback': function ( ) {
        hidePrompt();
        if (!$scope.gameData.player.flags.safeKicked) {
          $scope.gameData.targetZones = [ ];
          $scope.gameOver(
            'You failed to open the vault in time.<br />You <em>must</em> interact. It\'s not optional.'
          );
        }
        return false;
      }
    });

    $scope.gameEvents.push({        // INSTRUCTIONS: KEEP YOUR EYE HERE
      'offset':33.00,
      'callback': function ( ) {
        showPrompt('Good work. Watch here for instructions.');
        return false;
      }
    });

    $scope.gameEvents.push({        // INSTRUCTIONS: KEEP YOUR EYE HERE
      'offset':40.00,
      'callback': function ( ) {
        hidePrompt();
        return false;
      }
    });

    $scope.gameEvents.push({        // INSTRUCTIONS: FOR NOW
      'offset':48.00,
      'callback': function ( ) {
        showPrompt('I made this to inspire others.<br /><small>- Rob Colbert</small>');
        return false;
      }
    });

    $scope.gameEvents.push({        // INSTRUCTIONS: FOR NOW
      'offset':55.100,
      'callback': function ( ) {
        hidePrompt();
      }
    });

    $scope.gameEvents.push({        // ENEMY INCOMING!!
      'offset':65.00,
      'callback': function ( ) {
        $scope.titleCard.title = '!! ENEMY INCOMING !!';
        $scope.titleCard.description = 'Things are about to get quite twisted. #buckleup';
        titleCard.fadeIn(1000);
        return false;
      }
    });

    $scope.gameEvents.push({        // GAME PLAY BEGINS!!
      'offset':68.870,
      'callback': function ( ) {
        $scope.youtubeVideo1.seekTo(119.000);
        titleCard.fadeOut(200);
        return false;
      }
    });

    $scope.gameEvents.push({        // SHOOT THE DRONE!
      'offset':72.200,
      'callback': function ( ) {
        var engineHitsLeft = 5;
        showPrompt('SHOOT THE DRONE\'S ENGINE!!');
        $scope.gameData.targetZones.push({
          'x':0.816,
          'y':0.627,
          'width':0.318,
          'height':0.515,
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
        return false;
      }
    });

    $scope.gameEvents.push({        // JUMP THE WALL!
      'offset': 75.716,
      'callback': function ( ) {
        hidePrompt();
        $scope.youtubeVideo1.seekTo(130.1);
        return false;
      }
    });

    $scope.gameEvents.push({        // RIDE FOR YOUR LIFE!
      'offset': 84.0,
      'callback': function ( ) {
        $scope.titleCard.title = 'RIDE FOR YOUR LIFE!';
        $scope.titleCard.description = 'Okay, let\'s chat about this drone.';
        titleCard.fadeIn(4000.0);
        $scope.youtubeVideo1.setVolume(100);
        WebAudio.gain.gain.value = 0.25;
        return false;
      }
    });

    $scope.gameEvents.push({        // RIDE FOR YOUR LIFE! card 2
      'offset':90.0,
      'callback': function ( ) {
        $scope.titleCard.description = 'That might be Obama\'s <em>personal</em> drone.';
        $scope.youtubeVideo1.setVolume(0);
        WebAudio.gain.gain.value = 1.0;
        return false;
      }
    });

    $scope.gameEvents.push({        // RIDE FOR YOUR LIFE! card 3
      'offset':94.0,
      'callback': function ( ) {
        $scope.titleCard.description = 'You can\'t defeat it now. You must run!';
      }
    });

    $scope.gameEvents.push({        // PROMPT: SERIOUS ABOUT THAT DIE PART
      'offset':97.0,
      'callback': function ( ) {
        titleCard.fadeOut(100);
        return false;
      }
    });

    $scope.gameEvents.push({        // PROMPT: SERIOUS ABOUT THAT DIE PART
      'offset':101.0,
      'callback': function ( ) {
        showPrompt('HELP GUIDE OUR HERO TO SAFETY');
        return false;
      }
    });

    $scope.gameEvents.push({        // PROMPT: SERIOUS ABOUT THAT DIE PART
      'offset':105.0,
      'callback': function ( ) {
        hidePrompt();
      }
    });

    $scope.gameEvents.push({        // PROMPT: SERIOUS ABOUT THAT DIE PART
      'offset':107.0,
      'callback': function ( ) {
        showPrompt('KEEP MOUSE/FINGER ON THIS TARGET AT ALL TIMES');
        WebAudio.gain.gain.value = 0.6;
        return false;
      }
    });

    $scope.gameEvents.push({        // HIDE PROMPT
      'offset':110.0,
      'callback': function ( ) {
        hidePrompt();
      }
    });

    $scope.gameEvents.push({        // FIRST CHECKPOINT
      'offset':122.88,
      'callback': function ( ) {
        $scope.titleCard.title = 'CHECKPOINT REACHED!';
        $scope.titleCard.description = 'You\'ll be able to continue from here';
        WebAudio.gain.gain.value = 1.0;
        titleCard.fadeIn(200);
        return false;
      }
    });

    $scope.gameEvents.push({        // DUCK MUSIC FOR WHEELIE SCENE
      'offset':128.5,
      'callback': function ( ) {
        titleCard.fadeOut(200);
        $scope.youtubeVideo1.setVolume(100);
        WebAudio.gain.gain.value = 0.4;
        return false;
      }
    });

    $scope.gameEvents.push({        // DESTROY THE MINI-DRONES: Tap with precision
      'offset': 137.0,
      'callback': function ( ) {
        $scope.youtubeVideo1.seekTo(223.5);
        $scope.titleCard.title='DESTROY THE MINI-DRONES';
        $scope.titleCard.description='Tap with precision to release and detonate the flares';
        titleCard.fadeIn(1000);
        return false;
      }
    });

    $scope.gameEvents.push({        // HIDE TITLE CARD; RESTORE PROGRAM AUDIO
      'offset': 141.0,
      'callback': function ( ) {
        $scope.youtubeVideo1.setVolume(0);
        WebAudio.gain.gain.value = 1.0;
        titleCard.fadeOut(500);
        return false;
      }
    });

    $scope.gameEvents.push({        // VIDEO JUMP TO NEXT FLARE BATTLE
      'offset': 151.0,
      'callback': function ( ) {
        $scope.youtubeVideo1.seekTo(282.000);
        $scope.youtubeVideo1.setVolume(100);
        WebAudio.gain.gain.value = 0.7;
        return false;
      }
    });


    $scope.gameEvents.push({        // VICTORY! Now that's what's up, hero!
      'offset': 178.200,
      'callback': function ( ) {
        $scope.titleCard.title='VICTORY!';
        $scope.titleCard.description='Now that\'s what\'s up, hero!!';
        WebAudio.gain.gain.value = 1.0;
        titleCard.fadeIn(4000);
        return false;
      }
    });

    $scope.gameEvents.push({        // HIDE TITLE CARD
      'offset': 183.000,
      'callback': function ( ) {
        $scope.youtubeVideo1.setVolume(0);
        titleCard.fadeOut(1000);
      }
    });

    $scope.gameEvents.push({        // BOSS FIGHT CHECKPOINT
      'offset': 188.200,
      'callback': function ( ) {
        $scope.titleCard.title='BOSS FIGHT CHECKPOINT!';
        $scope.titleCard.description='Just when you\'d think a hero would be safe...';
        titleCard.fadeIn(2000);
        return false;
      }
    });

    $scope.gameEvents.push({        // 2ND MINI-DRONE FLARE
      'offset': 192.100,
      'callback': function ( ) {
        titleCard.fadeOut(500);
        return false;
      }
    });

    $scope.gameEvents.push({        // 2ND MINI-DRONE FLARE
      'offset': 199.100,
      'callback': function ( ) {
        $scope.titleCard.title='APP DEVELOPER BE LIKE:';
        $scope.titleCard.description='What the hell? I only asked if I could use Node.js';
        titleCard.fadeIn(500);
        return false;
      }
    });

    $scope.gameEvents.push({        // SYNC POINT ENSURES PROPER ENDING
      'offset': 202.500,
      'callback': function ( ) {
        // jump three seconds ahead to sync-up with the amazing end scene :)
        var ct = $scope.youtubeVideo1.getCurrentTime();
        console.log('YOUTUBE JUMP AT LOCATION', ct);
        $scope.youtubeVideo1.seekTo(ct + 10.0);
        titleCard.fadeOut(1000, function ( ) {
          showPrompt('Okay, this fucker\'s going down. NOW.');
        });
        return false;
      }
    });

    $scope.gameEvents.push({        // HIDE PROMPT
      'offset': 212.783,
      'callback': function ( ) {
        hidePrompt();
        return false;
      }
    });

    $scope.gameEvents.push({        //
      'offset': 222.000,
      'callback': function ( ) {
        showPrompt('A day at the office should never be like this...');
        return false;
      }
    });

    $scope.gameEvents.push({        //
      'offset': 228.000,
      'callback': function ( ) {
        hidePrompt();
      }
    });

    $scope.gameEvents.push({        // HEADS-UP: TAP AS FAST AS YOU CAN
      'offset': 235.353,
      'callback': function ( ) {
        showPrompt('When told, click or tap as fast as you can!');
        return false;
      }
    });

    $scope.gameEvents.push({        // HIDE PROMPT
      'offset': 239.000,
      'callback': function ( ) {
        hidePrompt();
        return false;
      }
    });

    $scope.gameEvents.push({        // CLICK! CLICK! CLICK
      'offset': 241.000,
      'callback': function ( ) {
        showPrompt('CLICK! CLICK! CLICK!');
        return false;
      }
    });

    $scope.gameEvents.push({        // CLICK! CLICK! CLICK
      'offset': 247.000,
      'callback': function ( ) {
        hidePrompt();
        return false;
      }
    });

    $scope.gameEvents.push({        // 2ND MINI-DRONE FLARE
      'offset': 275.000,
      'callback': function ( ) {
        $scope.titleCard.title='THANKS FOR SHARING THIS WITH ME';
        $scope.titleCard.description='';
        titleCard.fadeIn(4000);
        return false;
      }
    });

    $scope.gameEvents.push({        // 2ND MINI-DRONE FLARE
      'offset': 279.000,
      'callback': function ( ) {
        $scope.titleCard.description='...because I\'m saying goodbye (not hello).';
        return false;
      }
    });

    $scope.gameEvents.push({        // MY FINAL PROGRAM
      'offset': 283.000,
      'callback': function ( ) {
        $scope.titleCard.title='';
        $scope.titleCard.description='I am no longer seeking employment creating software.';
        return false;
      }
    });

    $scope.gameEvents.push({        // I WON'T DO THIS UP-HILL
      'offset': 287.000,
      'callback': function ( ) {
        $scope.titleCard.description='I can\'t/won\'t do this up-hill for the rest of my life.';
        return false;
      }
    });
    $scope.gameEvents.push({        // FADE OUT TITLE
      'offset': 290.000,
      'callback': function ( ) {
        titleCard.fadeOut(5000);
        $scope.youtubeVideo1.setVolume(100);
        return false;
      }
    });

    $scope.gameEvents.push({
      'offset':295,
      'callback': function ( ) {
        showPrompt('Best regards,<br />-Rob');
        return false;
      }
    });

    $scope.gameEvents.push({
      'offset': 299.000,
      'callback': function ( ) {
        hidePrompt();
      }
    });

    $scope.gameEvents.push({
      'offset': 303.000,
      'callback': function ( ) {
        PresentationEngine.setDisplayMode(PresentationEngine.DisplayModes.STANDARD);
        return false;
      }
    });

  };

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
        switch (newState.data) {
          case -1: // STOPPED
            $scope.videoStateLabel = 'STOPPED';
            ga('send', 'event', 'Videos', 'videoStopped', 1);
            if (uiUpdateInterval !== null) {
              $interval.cancel(uiUpdateInterval);
              uiUpdateInterval = null;
            }
            break;

          case 0: // END
            PresentationEngine.setDisplayMode(PresentationEngine.DisplayModes.STANDARD);
            $scope.videoStateLabel = 'END';
            ga('send', 'event', 'Videos', 'videoFinished', 1);
            if (uiUpdateInterval !== null) {
              $interval.cancel(uiUpdateInterval);
              uiUpdateInterval = null;
            }
            break;

          case 1: // PLAYING
            $scope.audio.play();
            PresentationEngine.setDisplayMode(PresentationEngine.DisplayModes.THEATER);
            $scope.videoStateLabel = 'PLAYING';
            if (firstPlay) {
              firstPlay = false;
              $scope.gameInit();
            }
            if (uiUpdateInterval === null) {
              uiUpdateInterval = $interval(updateUI, 1000.0 / 30.0);
            }
            break;

          case 2: // PAUSED
            PresentationEngine.setDisplayMode(PresentationEngine.DisplayModes.STANDARD);
            $scope.videoStateLabel = 'PAUSED';
            $scope.audio.pause();
            break;

          case 3: // BUFFERING
            $scope.videoStateLabel = 'BUFFERING';
            break;

          case 4: // CUED
            $scope.videoStateLabel = 'CUED';
            break;
        }
        self.videoState = newState.data;
      });
    });
    $scope.ready = true;
  });

}

MovingPartsCtrl.$inject = [
  '$scope',
  '$window',
  '$interval',
  '$sce',
  'PresentationEngine',
  'WebAudio',
  'SoundCloud',
  'Configuration'
];

angular.module('robcolbertApp')
.controller('MovingPartsCtrl', MovingPartsCtrl);
