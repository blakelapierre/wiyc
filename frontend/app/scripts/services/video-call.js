// services/video-call.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function PulsarVideoCall (WebAudio, UserMedia) {

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
  })
  .error(function (error) {
    console.error('getUserMedia error', error);
  });

};

PulsarVideoCall.prototype.disconnect = function ( ) {

};

PulsarVideoCall.$inject = [
  'WebAudio',
  'UserMedia'
];

angular.module('pulsarClientApp')
.service('PulsarVideoCall', PulsarVideoCall);
