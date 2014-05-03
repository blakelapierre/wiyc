// controllers/user/profile.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function UserProfileCtrl ($scope, $route, $location, $window, $sce, UserSession, Users, Pulses) {

  $window.scrollTo(0, 0);
  $scope.haveError = false;
  $scope.session = UserSession.session;

  $scope.calendarMoment = function (date, format) {
    return moment(date).format(format);
  };

  $scope.fromNow = function (date, format) {
    return moment(date).fromNow(format);
  };

  angular.element('.profile-photo-wrap').hover(
    function ( ) {
      angular.element(this).find('.profile-photo-menu').addClass('visible');
    },
    function ( ) {
      angular.element(this).find('.profile-photo-menu').removeClass('visible');
    }
  );

  var userId = null;
  if ($route.current.params.userId) {
    userId = $route.current.params.userId;
    $scope.isMyProfile = (userId.toString() === UserSession.session.user._id.toString());
  } else if (UserSession.session.user._id) {
    userId = UserSession.session.user._id;
    $scope.isMyProfile = true;
  }

  $scope.user = Users.get(
    { 'userId': userId },
    function onGetUserSuccess (user) {
      $scope.haveError = false;
      $scope.isMyProfile = ($scope.session.authenticated.status && (user._id === $scope.session.user._id));
      user.photoUrl = 'images/profile-default.png';
      console.log('Users.get', user);
    },
    function onGetUserError (error) {
      $scope.haveError = true;
      ga('send','event', 'user-profile', 'createError', 1);
      $scope.$emit('pulsarServiceError', error);
      console.log('Users.get error', error);
    }
  );

  $scope.loadPulse = function (pulse) {
    var pulseId = pulse._id.toString();
    console.log('loading pulse', pulseId);
    $location.path('/pulses/' + pulseId);
    $location.search('filter', null);
  };

  $scope.publishPulse = function (pulse) {

  };

  $scope.deletePulse = function (pulse) {

  };

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
        $scope.$emit('pulsarServiceError', error);
      }
    );
  };

  $scope.loadPulses = function ( ) {
    $scope.pulses = Pulses.list(
      { 'userId': userId, 'status': $scope.pulseStatusFilter },
      function onSetPulseFilterSuccess (pulses) {
        $scope.pulses = pulses;
      },
      function onSetPulseFilterError (error) {
        $scope.$emit('setServiceError', error);
      }
    );
  }

  $scope.setPulseFilter = function (pulseStatusType) {
    $location.search('filter', pulseStatusType);
    $scope.pulseStatusFilter = pulseStatusType;
    $scope.loadPulses();
  };

  if ($scope.isMyProfile) {
    $scope.pulseStatusFilter = $location.search().filter || 'published';
  } else {
    $location.search('filter', null);
    $scope.pulseStatusFilter = 'published';
  }
  $scope.loadPulses();
}

UserProfileCtrl.$inject = [
  '$scope',
  '$route',
  '$location',
  '$window',
  '$sce',
  'UserSession',
  'Users',
  'Pulses'
];

angular.module('pulsarClientApp')
.controller('UserProfileCtrl', UserProfileCtrl);
