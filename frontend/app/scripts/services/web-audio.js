// services/web-audio.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT
//
// The Pulsar Web Audio service exists to provide a system-wide interface to the
// Web Audio API. It has an end-stage mixing console of its own with a master
// gain, dynamics compressor (to finally "tame" the web's volume levels). To
// support wickedly advanced visuals, it splits the final/mixed audio stream
// into separate left and right channels, analyses them and then recombines them
// into a stereo stream for presentation to the audio subsystem.

'use strict';

function WebAudioService ($window) {

  //TODO Split the ingress audio using a channel splitter node into separate
  // left and right channels. Pump each into an analyser node and analyse left
  // and right audio separately. Then, rejoin the audio for presentation to the
  // final mixdown section.

  var AudioContext = $window.AudioContext || $window.webkitAudioContext;
  this.context = null;
  this.masterGain = null;
  this.analysers = { 'left': null, 'right': null };
  this.compressor = null;
  this.sources = [ ];

  try {
    /*
     * This stage splits the input into two discreet channels, runs separate
     * left and right analysers on them and then recombines them into the
     * channel merger.
     *                             ->analysers.L-
     * [compressor below]->splitter-            ->merger->context.destination
     *                             ->analysers.R-
     */
    this.context = new AudioContext();

    this.channelMerger = this.context.createChannelMerger(2);
    this.channelMerger.connect(this.context.destination);

    this.analysers.left = this.createAnalyser(0.4, 1024);
    this.analysers.left.analyser.connect(this.channelMerger, 0, 0);

    this.analysers.right = this.createAnalyser(0.4, 1024);
    this.analysers.right.analyser.connect(this.channelMerger, 0, 1);

    console.log('analysers', this.analysers);

    this.channelSplitter = this.context.createChannelSplitter(2);
    this.channelSplitter.connect(this.analysers.left.analyser, 0);
    this.channelSplitter.connect(this.analysers.right.analyser, 1);

    /*
     * This is the mixer input section. The main input to which things should
     * connect is masterGain.
     *
     * masterGain->compressor->[splitter above]
     */

    this.compressor = this.context.createDynamicsCompressor();
    this.compressor.connect(this.channelSplitter);

    this.masterGain = this.context.createGain();
    this.masterGain.connect(this.compressor);

  } catch (error) {
    console.log('web-audio service error', error);
  }
}

WebAudioService.prototype.update = function ( ) {
  this.analysers.left.update();
  this.analysers.right.update();
};

WebAudioService.prototype.createAnalyser = function (smoothingTimeConstant) {
  var container = { };
  try {
    container.analyser = this.context.createAnalyser();
    container.analyser.smoothingTimeConstant = smoothingTimeConstant;
    container.freqByteData = new Uint8Array(container.analyser.frequencyBinCount);
    container.timeByteData = new Uint8Array(container.analyser.frequencyBinCount);
    container.update = function ( ) {
      container.analyser.getByteFrequencyData(container.freqByteData);
      container.analyser.getByteTimeDomainData(container.timeByteData);
    };
  } catch (error) {
    console.log('web-audio service error', error);
  }
  return container;
};

WebAudioService.prototype.createMediaElementSource = function (element) {
  var source;
  try {
    source = this.context.createMediaElementSource(element);
    source.connect(this.masterGain);
  } catch (error) {
    console.log('createMediaElementSource failed', error, element);
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

angular.module('pulsarClientApp')
.service('WebAudio', WebAudioService);
