// controllers/user/profile.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function UserUseridCtrl ($scope, $route, UserSession, Users, Pulses) {
  $scope.haveError = false;

  $scope.calendarMoment = function (date, format) {
    return moment(date).format(format);
  };

  $scope.fromNow = function (date, format) {
    return moment(date).fromNow(format);
  };

  angular.element('.profile-photo-wrap').hover(
    function ( ) {
      angular.element(this).find('.profile-photo-menu').css('display', 'block');
    },
    function ( ) {
      angular.element(this).find('.profile-photo-menu').css('display', 'none');
    }
  );

  var userId = $route.current.params.userId || UserSession.session.user._id;
  $scope.user = Users.get(
    { 'userId': userId },
    function onGetUserSuccess (user) {
      $scope.haveError = false;
      console.log('Users.get', user);
    },
    function onGetUserError (error) {
      $scope.haveError = true;
      ga('send','event', 'user-profile', 'createError', 1);
      $scope.$emit('setServiceError', error);
      console.log('Users.get error', error);
    }
  );

  $scope.pulses = Pulses.list(
    { 'userId': userId },
    function onPulsesListSuccess (pulses) {

    },
    function onPulsesListError (error) {

    }
  );

  $scope.isSaving = false;
  $scope.contentChanged = function ( ) {
    $scope.isSaving = true;
    $scope.user.$update(
      { 'userId': $scope.user._id },
      function onUserUpdateSuccess (user) {
        $scope.isSaving = false;
      },
      function onUpdateUserError (error) {
        console.error('user update error', error);
        $scope.isSaving = false;
      }
    );
  };
}

UserUseridCtrl.$inject = [
  '$scope',
  '$route',
  'UserSession',
  'Users',
  'Pulses'
];

angular.module('pulsarClientApp')
.controller('UserUseridCtrl', UserUseridCtrl);
