// services/user-media.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function UserMediaService ($rootScope) {

  this.$rootScope = $rootScope;
  this.mediaStream = null;

}

UserMediaService.prototype.getUserMedia = function (options) {

  var successDelegate = function ( ) { };
  var onGetUserMediaSuccess = function (mediaStream) {
    console.log('getUserMedia', mediaStream);
    self.mediaStream = mediaStream;
    self.$rootScope.$broadcast('pulsarUserMediaStreamStart', mediaStream);
    successDelegate(mediaStream);
  };

  var errorDelegate = function ( ) { };
  var onGetUserMediaError = function (error) {
    console.log('getUserMedia error', error);
    self.$rootScope.$broadcast('pulsarUserMediaStreamError', error);
    errorDelegate(error);
  };

  if (navigator.getUserMedia) {
    navigator.getUserMedia(options, onGetUserMediaSuccess, onGetUserMediaError);
  } else if (navigator.webkitGetUserMedia) {
    navigator.webkitGetUserMedia(options, onGetUserMediaSuccess, onGetUserMediaError);
  } else if (navigator.mozGetUserMedia) {
    navigator.mozGetUserMedia(options, onGetUserMediaSuccess, onGetUserMediaError);
  } else if (navigator.msGetUserMedia) {
    navigator.msGetUserMedia(options, onGetUserMediaSuccess, onGetUserMediaError);
  }

  return {
    'success': function (handler) { successHandler = handler; },
    'error': function (handler) { errorHandler = handler; }
  };
};

UserMediaService.$inject = [
  '$rootScope'
];

angular.module('pulsarClientApp')
.service('UserMedia', UserMediaService);
