// controllers/settings.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

function SettingsCtrl ($scope, $rootScope, $window, Configuration, Users, UserSession) {

  if (!UserSession.checkAuthentication(UserSession.WITH_REDIRECT)) {
    return; // immediately abort all further processing
  }

  $window.scrollTo(0, 0);

  $scope.visibilityOptions = [
    {'name':'Public', 'value':'public', 'type':'Permissive'},
    {'name':'Friends Only', 'value':'friends', 'type':'Restrictive'},
    {'name':'Private', 'value':'private', 'type':'Restrictive'}
  ];

  $scope.user = Users.get(
    {'userId':UserSession.session.user._id},
    function onUserRetrieved ( ) {
      console.log('settings user object retrieved', $scope.user);
    },
    function onUserError (error) {
      console.log('settings user object error', error);
    }
  );

  $scope.save = function ( ) {
    Users.update(
      {'userId':UserSession.session.user._id},
      $scope.user,
      function onUserUpdateSuccess (user) {
        console.log('user updated successfully', user);
        $scope.user = user;
      },
      function onUserUpdateError (error) {
        console.log('user update failed', error);
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
  'UserSession'
];

angular.module('robcolbertApp')
.controller('SettingsCtrl', SettingsCtrl);
