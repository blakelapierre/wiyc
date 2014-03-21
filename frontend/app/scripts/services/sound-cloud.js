// -----------------------------------------------------------------------------
//
// FILE:
//
//  services/sound-cloud.js
//
// PURPOSE:
//
//  The Pulsar client application uses SoundCloudService to fetch metadata and
//  sound stream information from SoundCloud (api.soundcloud.com) as a
//  registered SoundCloud API client. It then passes the stream information to
//  the WebAudioService for interactive audio playback connected to the Pulsar
//  presentation service instead of using the SoundCloud "widget" as an iframe.
//
//  This deeper integration is what allows Pulsar to achieve that which other
//  content management systems do not: The richest, most deeply integrated and
//  entirely engaging experiences possible.
//
// -----------------------------------------------------------------------------
//
// LICENSE
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//
// -----------------------------------------------------------------------------

'use strict';

function SoundCloudService ($rootScope, $http, $sce) {
  var self = this;

  self.clientId = 'abff68edc2d08acf6e4d642eaba579ef';
  self.hasError = false;
  self.error = null;
  self.trackData = null;

  self.buildRequestUrl = function (serviceName, soundId) {
    var url = 'https://api.soundcloud.com/' + serviceName.toString() + '/' + soundId.toString() + '.json';
    return this.blessUrl(url);
  };

  self.blessUrl = function (url) {
    return url.toString() + '?client_id='+self.clientId;
  };

  self.loadTrackData = function (soundId, callback) {
    if (!angular.isString(soundId) && !angular.isNumber(soundId)) {
      return; // I'll get more verbose with exceptions later in hardening
    }

    var requestUrl = self.buildRequestUrl('tracks', soundId);
    $http({
      'method': 'GET',
      'url': requestUrl,
      'withCredentials': false
    })
    .success(function (trackData/*, status, headers, config*/) {
      // trackData trusted URLs
      // @TODO options group: "Trusted SoundCloud Sound URLs"
      trackData.artwork_url = $sce.trustAsUrl(trackData.artwork_url); // jshint ignore:line
      trackData.permalink_url = $sce.trustAsUrl(trackData.permalink_url); // jshint ignore:line
      trackData.purchase_url = $sce.trustAsUrl(trackData.purchase_url); // jshint ignore:line
      trackData.stream_url = $sce.trustAsUrl(trackData.stream_url); // jshint ignore:line
      trackData.uri = $sce.trustAsUrl(trackData.uri);
      trackData.waveform_url = $sce.trustAsUrl(trackData.waveform_url); // jshint ignore:line

      // trackData.user trusted URLs
      // @TODO options group: "Trust SoundCloud User URLs"
      trackData.user.avatar_url = $sce.trustAsUrl(trackData.user.avatar_url); // jshint ignore:line
      trackData.user.parmalink_url = $sce.trustAsUrl(trackData.user.permalink_url); // jshint ignore:line
      trackData.user.uri = $sce.trustAsUrl(trackData.user.uri);

      // trusted HTML content
      // @TODO options group: "Trusted SoundCloud HTML Content"
      trackData.description = $sce.trustAsHtml(
        trackData.description.replace(/\n/gi, '<br />')
      );

      self.trackData = trackData;

      if (angular.isDefined(callback)) {
        callback(null, trackData);
      }
    })
    .error(function onTrackError (errorData/*, status, headers, config*/) {
      console.log('TRACK DATA ERROR', errorData);
      self.trackData = null;
      self.error = errorData;
      self.hasError = true;
      if (angular.isDefined(callback)) {
        callback(errorData, null);
      }
    });
  };

//   self.loadComments = function (soundId, callback) {
//     var requestUrl = this.buildRequestUrl('comments', soundId);
//   };
}

SoundCloudService.$inject = [
  '$rootScope',
  '$http',
  '$sce'
];

angular.module('robcolbertApp')
.service('SoundCloud', SoundCloudService);
