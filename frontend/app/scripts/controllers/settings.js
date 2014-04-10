// controllers/settings.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function SettingsCtrl ($scope, $rootScope, $window, Configuration, Users, UserSession, Notifications) {
  if (!UserSession.checkAuthentication(UserSession.WITH_REDIRECT)) {
    return; // immediately abort all further processing
  }

  $window.scrollTo(0, 0);
  ga('send', 'pageview');

  $scope.notifications = { };
  $scope.onDesktopNotificationsChange = function ( ) {
    if (!$scope.user.settings.flags.desktopNotifications.enabled) {
      return;
    }
    Notifications.requestPermission(function (permission) {
      if (permission !== 'granted') {
        $scope.user.settings.flags.desktopNotifications.enabled = false;
        return;
      }
    });
  };

  $scope.haveError = false;
  $scope.error = null;

  $scope.visibilityOptions = [
    {'name':'Public', 'value':'public', 'type':'Permissive'},
    {'name':'Friends Only', 'value':'friends', 'type':'Restrictive'},
    {'name':'Private', 'value':'private', 'type':'Restrictive'}
  ];

  $scope.user = Users.get(
    {'userId':UserSession.session.user._id},
    function onUserRetrieved ( ) {
      ga('send','event', 'Settings', 'userLoadSuccess', 1);
      console.log('settings user object retrieved', $scope.user);
    },
    function onUserError (error) {
      ga('send','event', 'Settings', 'userLoadError', {'error':error});
      console.log('settings user object error', error);
    }
  );

  $scope.save = function ( ) {
    Users.update(
      {'userId':UserSession.session.user._id},
      $scope.user,
      function onUserUpdateSuccess (user) {
        console.log('user updated successfully', user);
        ga('send','event', 'Settings', 'userUpdateSuccess', 1);
        $scope.user = user;
        Notifications.showNotification('Pulsar System Message', {
          'tag':'pulsar_System',
          'body':'User settings saved successfully.'
        });
      },
      function onUserUpdateError (error) {
        console.log('user update failed', error);
        ga('send','event', 'Settings', 'userUpdateError', 1);
        $scope.error = error;
        $scope.haveError = true;
      }
    );
  };

}

SettingsCtrl.$inject = [
  '$scope',
  '$rootScope',
  '$window',
  'Configuration',
  'Users',
  'UserSession',
  'Notifications'
];

angular.module('pulsarClientApp')
.controller('SettingsCtrl', SettingsCtrl);
