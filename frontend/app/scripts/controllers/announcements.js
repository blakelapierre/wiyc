// controllers/announcements.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function AnnouncementsCtrl ($scope, $rootScope, $timeout) {

  $scope.announcements = [ ];

  var advanceTimeoutPromise = null;

  function advanceToNext ( ) {
    ga('send','event', 'Announcements', 'display', 1);
    $scope.announcement = $scope.announcements.shift();
    if (angular.isDefined($scope.announcement) && angular.isDefined($scope.announcement.displayTime) && ($scope.announcement.displayTime !== 'manual')) {
      advanceTimeoutPromise = $timeout(
        advanceToNext,
        $scope.announcement.displayTime || 10000
      );
    }
  }

  $rootScope.$on('showAnnouncement', function (event, announcement) {
    $scope.announcements.push(announcement);
    if (!angular.isDefined($scope.announcement)) {
      advanceToNext();
    }
  });

  $scope.nextAnnouncement = function ( ) {
    ga('send','event', 'Announcements', 'skipped', 1);
    if (advanceTimeoutPromise !== null) {
      $timeout.cancel(advanceTimeoutPromise);
      advanceTimeoutPromise = null;
    }
    advanceToNext();
  };

}

AnnouncementsCtrl.$inject = [
  '$scope',
  '$rootScope',
  '$timeout'
];

angular.module('pulsarClientApp')
.controller('AnnouncementsCtrl', AnnouncementsCtrl);
