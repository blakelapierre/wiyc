// FILE
//
//  services/web-audio.js
//
// PURPOSE
//
//  Implement an AngularJS service to provide universal, singleton-style access
//  to the WebAudio API powered audio playback and visualization engine of
//  Pulsar. This is, however, a generic reusable interface to the Web Audio API
//  with no additional dependencies. It does not use 3rd-party tech at all, and
//  provides its own interface to the WebAudio API usable by Pulsar and other
//  applications.
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

function WebAudioService ($window) {
  var AudioContext = $window.AudioContext || $window.webkitAudioContext;
  this.context = null;
  this.gain = null;
  this.analyser = null;
  this.freqByteData = null;
  this.timeByteData = null;
  this.sources = [ ];
  try {
    this.context = new AudioContext();
    this.gain = this.context.createGain();
    this.gain.connect(this.context.destination);
    this.analyser = this.context.createAnalyser();
    this.analyser.connect(this.gain);
    this.freqByteData = new Uint8Array(this.analyser.frequencyBinCount);
    this.timeByteData = new Uint8Array(this.analyser.frequencyBinCount);
    console.log('PULSAR-WebAudio initialized successfully', this.context);
  } catch (e) {
    console.log('PUASAR-WebAudio error', e);
  }
}


WebAudioService.prototype.updateFrequencyAnalysis = function ( ) {
  this.analyser.getByteFrequencyData(this.freqByteData);
};


WebAudioService.prototype.updateTimeAnalysis = function ( ) {
  this.analyser.getByteTimeDomainData(this.timeByteData);
};


WebAudioService.prototype.createMediaElementSource = function (element) {
  var source;
  try {
    source = this.context.createMediaElementSource(element);
    source.connect(this.analyser);
  } catch (e) {
    console.log('PULSAR-WebAudio createMediaElementSource', element, e);
  }
  return source;
};


WebAudioService.prototype.createMediaElementSourceById = function (elementId) {
  var element, source;
  element = document.getElementById(elementId);
  if (!element) {
    return null;
  }
  //@TODO test if Audio or Video element, report an error otherwise

  source = this.createMediaElementSource(element);
  this.sources[elementId] = source;
  return source;
};


WebAudioService.prototype.getElementSource = function (elementId) {
  return this.sources[elementId];
};


WebAudioService.$inject = [
  '$window'
];


angular.module('robcolbertApp')
.service('WebAudio', WebAudioService);
