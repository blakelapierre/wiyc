// services/web-audio.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

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
