/*
 * FILE
 *  controllers/settings.js
 *
 * PURPOSE
 *
 *
 * LICENSE
 *  Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to
 *  deal in the Software without restriction, including without limitation the
 *  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 *  sell copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 *  IN THE SOFTWARE.
 */

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

angular.module('robcolbertApp')
.controller('SettingsCtrl', SettingsCtrl);
