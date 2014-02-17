'use strict';

angular.module('robcolbertApp')
.controller('VideosCtrl', [
  '$window',
  '$scope',
  '$sce',
  '$timeout',
  '$interval',
  function ($window, $scope, $sce, $timeout, $interval) {
    $scope.$emit('setPageGroup', 'videos');
    $scope.videos = [
      {
        'type':'hosted',
        'title':'ASO-RT Demo: Dynamic Data Sources',
        'description': 'Demonstration of creating new dataSource instances and the charts and grids that display them.',
        'url': 'videos/asort-mean.001.ogv'
      },
      {
        'type':'youtube',
        'title':'Quadski (One Awesome Vehicle)',
        'description':'Possibly the most awesome vehicle on the surface of Earth right now. Would <em>love</em> to commute to work on this!',
        'videoId':'xOCxT89ynbA'
      },
      {
        'type':'youtube',
        'title':'Adventure Club - Wonder (Dabin Remix)',
        'description':'Published on Feb 14, 2014',
        'videoId':'2xXMqJwndTU'
      },
      {
        'type':'youtube',
        'title':'Reach For The Sky (Ft. Diane Charlemagne) (The Others Remix)',
        'description':'Published on Feb 10, 2014',
        'videoId':'XKNOc6XDyRo'
      }
    ];

    $scope.players = { };

    $scope.playVideo = function (videoId) {
      $scope.players[videoId].playVideo();
    };

    $scope.pauseVideo = function (videoId) {
      $scope.players[videoId].pauseVideo();
    };

   $window.onYouTubeIframeAPIReady = function ( ) {
      console.log('YouTube <iframe> API ready');
      $scope.videos.forEach(function (video) {
        switch (video.type) {
          case 'youtube':
//             $timeout(function ( ) {
//               var params = { 'allowScriptAccess': 'always' };
//               var atts = { 'id': video.videoId };
//               // var embedUrl = 'http://www.youtube.com/embed/'+video.videoId+'?enablejsapi=1&playerapiid='+video.videoId+'&version=3';
//               var embedUrl = 'http://www.youtube.com/apiplayer?enablejsapi=1&version=3&playerapiid='+video.videoId;
//               video.url = $sce.trustAsResourceUrl(embedUrl);
//               swfobject.embedSWF(embedUrl, video.videoId, '425', '356', '8', null, null, params, atts);
//             }, 0);

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
                          break;
                        case 1:
                          video.stateLabel = 'play';
                          $scope.videoUpdateIntervalId = $interval(function ( ) {
                            var player = $scope.players[video.videoId];
                            video.currentTime = Math.round(player.getCurrentTime());
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
      });
    }

    $window.onYouTubePlayerReady = function (playerId) {
      console.log('YouTube Player API ready');
    };

  }
]);
