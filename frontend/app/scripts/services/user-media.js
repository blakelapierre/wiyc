// services/user-media.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function UserMediaService ($rootScope) {

  this.$rootScope = $rootScope;

}

UserMediaService.prototype.getUserMedia = function (options) {
  var self = this;

  var onGetUserMediaSuccess = function (mediaStream) {
    var video = document.getElementById(options.videoElementId);
    video.src = window.URL.createObjectURL(mediaStream);
    self.$rootScope.$broadcast('pulsarUserMediaStreamStart', mediaStream);
    video.onloadedmetadata = function (metadata) {
      // Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
      // See crbug.com/110938.
      console.log('have user media stream', metadata);
    };
  };

  var onGetUserMediaError = function (error) {
    console.log('getUserMedia error', error);
    self.$rootScope.$broadcast('pulsarUserMediaStreamError', error);
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

};

UserMediaService.$inject = [
  '$rootScope'
];

angular.module('pulsarClientApp')
.service('UserMedia', UserMediaService);
