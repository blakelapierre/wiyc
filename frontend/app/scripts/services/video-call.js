// services/video-call.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function PulsarVideoCall ($rootScope, WebAudio, UserMedia) {
  this.$rootScope = $rootScope;
  this.WebAudio = WebAudio;
  this.UserMedia = UserMedia;
  this.userMediaStream = null;
}

PulsarVideoCall.prototype.connect = function ( ) {
  var self = this;

  this.UserMedia.getUserMedia({
    'video': true,
    'audio': true
  })
  .success(function (userMediaStream) {
    console.log('Have local user media stream.');
    self.userMediaStream = userMediaStream;
    self.$rootScope.$broadcast('pulsarUserMediaStreamStart', userMediaStream);
    return self;
  })
  .error(function (error) {
    console.error('getUserMedia error', error);
    self.$rootScope.$broadcast('pulsarUserMediaStreamError', error);
    return self;
  });

};

PulsarVideoCall.prototype.disconnect = function ( ) {

};

PulsarVideoCall.$inject = [
  '$rootScope',
  'WebAudio',
  'UserMedia'
];

angular.module('pulsarClientApp')
.service('PulsarVideoCall', PulsarVideoCall);
