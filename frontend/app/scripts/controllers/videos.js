// controllers/videos.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

angular.module('robcolbertApp')
.controller('VideosCtrl', [
  '$window',
  '$scope',
  '$sce',
  '$timeout',
  '$interval',
  'Videos',
  function ($window, $scope, $sce, $timeout, $interval, Videos) {

    $window.scrollTo(0, 0);
    $scope.$emit('setPageGroup', 'videos');
    ga('send', 'pageview');

    /*
     * 'type':'hosted',
     * 'title':'ASO-RT Demo: Dynamic Data Sources',
     * 'description': 'Demonstration of creating new dataSource instances and the charts and grids that display them.',
     * 'url': 'videos/asort-mean.001.ogv'
     */
    $scope.videoList = Videos.list( );//@TODO: this was a hack to appease jshint. change back to $scope.videos =
    $scope.videos = [
      {
        'type':'youtube',
        'title':'RUIN 3D',
        'description':'',
        'videoId':'1UjEVnmXL0o'
      },
      {
        'type':'youtube',
        'title':'What if it already was enterprise grade?',
        'description':'<a href="mailto:rob.isConnected@gmail.com">rob.isConnected@gmail.com</a> or <a href="https://twitter.com/robcolbert">@robcolbert</a>. I suck at every other way of keeping in touch, YouTube included.',
        'videoId':'xQgpHzSru1Y'
      },
      {
        'type':'youtube',
        'title':'Snowfall in Pittsburgh, 1080p',
        'description':'1080p video from my Galaxy S3 of some awesome snowfall in Cranberry Twp, PA. Pulsar\'s video player is fully responsive. This looks awesome from mobile to a 1080p TV and back by way of a phablet and a wristwatch. Gadget geeks beware: UNOGET2COMPLAIN!',
        'videoId':'nn0PcfR0Vtk'
      },
//       {
//         'type':'youtube',
//         'title':'Virus Syndicate - Sick Wid It [Official Music Video]',
//         'description':'They should have listened from the get-go, \'cause we ain\'t ever gonna let go... We\'re gettin\' sick wid it ;)',
//         'videoId':'v4kBSxX4N_0'
//       },
      {
        'type':'youtube',
        'title':'Anant Narayanan - Building Realtime Apps With Firebase and Angular - NG-Conf 2014',
        'description':'Firebase is listed as the default way to add a backend to your Angular app on the AngularJS homepage. Come and see why. In this talk you\'ll learn about how to use Firebase and Angular together and learn why building a modern realtime app will never be the same again.',
        'videoId':'e4yUTkva_FM'
      }
    ];

    $scope.players = { };

    $scope.playVideo = function (videoId) {
      ga('send', 'event', 'Videos', 'videoPlayed', 1);
      $scope.players[videoId].playVideo();
    };

    $scope.pauseVideo = function (videoId) {
      ga('send', 'event', 'Videos', 'videoPaused', 1);
      $scope.players[videoId].pauseVideo();
    };

    function initializeVideo (video) {
      switch (video.type) {
        case 'youtube':
          $timeout(function ( ) {
            $scope.players[video.videoId] = new $window.YT.Player(video.videoId, {
              height: '390',
              width: '640',
              videoId: video.videoId,
              playerVars: {
                controls: 0,
                modestbranding: 1,
                playsinline: 0 /* full-screen on iProducts, please */,
                showinfo: 0
              },
              events: {
                'onReady': function onReady ( ) {
                  console.log('YouTube video', video.videoId, 'is ready');
                },
                'onStateChange': function onPlayerStateChange (newState) {
                  if ($scope.videoUpdateIntervalId !== null) {
                    clearInterval($scope.videoUpdateIntervalId);
                    $scope.videoUpdateIntervalId = null;
                  }
                  console.log('onPlayerStateChange', video.videoId, 'newState', video.state);
                  $scope.$apply(function ( ) {
                    video.state = newState.data;
                    switch (video.state) {
                      case -1:
                        video.stateLabel = '';
                        break;
                      case 0:
                        video.stateLabel = 'end';
                        ga('send', 'event', 'Videos', 'videoFinished', 1);
                        break;
                      case 1:
                        video.stateLabel = 'play';
                        $scope.videoUpdateIntervalId = $interval(function ( ) {
                          var player = $scope.players[video.videoId];
                          video.currentTime = Math.round(player.getCurrentTime());
                          video.currentTimeRaw = player.getCurrentTime();
                          video.duration = Math.round(player.getDuration().toFixed(2));
                          video.playedFraction = (video.currentTime / video.duration).toFixed(2);
                          video.loadedFraction = (player.getVideoLoadedFraction()).toFixed(2);
                        }, 100);
                        break;
                      case 2:
                        video.stateLabel = 'pause';
                        break;
                      case 3:
                        video.stateLabel = 'buffer';
                        break;
                      case 4:
                        video.stateLabel = 'cued';
                        break;
                    }
                  });
                }
              }
            });
          }, 0);
          break;
      }
    }

    $scope.setVideoTime = function (video) {
      console.log('setVideoTime', video.userDesiredTime);
      var player = $scope.players[video.videoId];
      player.seekTo(video.userDesiredTime, true);
    };

    function createPlayers ( ) {
      $scope.videos.forEach(initializeVideo);
    }

    $window.onYouTubeIframeAPIReady = function ( ) {
      console.log('YouTube <iframe> API ready');
      createPlayers();
      $scope.playerReady = true;
    };

    $window.onYouTubePlayerReady = function (/*playerId*/) {
      console.log('YouTube Player API ready');
    };

    createPlayers();
    $scope.playerReady = true;

  }
]);
