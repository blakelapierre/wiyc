// directives/soundcloud-player.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function PulsarSoundCloudPlayer (WebAudio, scope, element, attrs) {
  this.audio = WebAudio;
  this.scope = scope;
  this.element = element;
  this.attrs = attrs;
}

PulsarSoundCloudPlayer.prototype.link = function ( ) {

  this.widget = this.element.find('.pulsar-widget');

  this.player = this.widget.find('.soundcloud-player');
  this.playerOriginalBgColor = this.player.css('background-color');

  this.progressContainer = this.player.find('.progress-container');
  this.progressContainer.css('background-color', 'rgb(16,48,64)');

  this.progressBar = this.player.find('.progress-bar');
  this.progressBar.css('background-color', 'rgb(96,192,255)');

  this.visualiser = this.player.find('.visualiser');
  this.visualiser.css('background-color', 'rgb(16,48,64)');

  // this.game = container.find('.game-canvas');
};

PulsarSoundCloudPlayer.prototype.update = function ( ) {
    var self = this;

    var ctx = self.visualiser[0].getContext('2d');
    var ctxWidth = ctx.canvas.width;
    var ctxHeight = ctx.canvas.height;

    ctx.lineCap = 'round';
    ctx.clearRect(0, 0, ctxWidth, ctxHeight)

    var graphH = 64.0;
    var drawX, drawY;
    var power;

    var bassAvg = 0.0;
    var midsAvg = 0.0;
    var trebAvg = 0.0;

    function renderFrequencyBar (x, power) {
      var barH = graphH * (self.audio.analysers.left.freqByteData[x] / 256.0);
      ctx.fillRect(x, graphH, 1, -barH);
    }

    var idx = 0;
    var bassCutoff = 80;
    var midsCutoff = 256;
    var trebCutoff = 768;

    ctx.fillStyle = 'rgb(220,0,0)';
    for ( ; idx < bassCutoff; ++idx) {
      power = self.audio.analysers.left.freqByteData[idx];
      bassAvg += power;
      renderFrequencyBar(idx, power);
    }
    bassAvg = parseInt(bassAvg / bassCutoff);

    ctx.fillStyle = 'rgb(0,220,0)';
    for ( ; idx < midsCutoff; ++idx) {
      power = self.audio.analysers.left.freqByteData[idx];
      midsAvg += power;
      renderFrequencyBar(idx, power);
    }
    midsAvg = parseInt(midsAvg / (midsCutoff - bassCutoff));

    ctx.fillStyle = 'rgb(0,0,220)';
    for ( ; idx < trebCutoff; ++idx) {
      power = self.audio.analysers.left.freqByteData[idx];
      trebAvg += power;
      renderFrequencyBar(idx, power);
    }
    trebAvg = parseInt(trebAvg / (trebCutoff - midsCutoff));

    var audioColor = 'rgb('+bassAvg+','+midsAvg+','+trebAvg+')';

    var bassRatio = bassAvg / 255.0;
    var midsRatio = midsAvg / 255.0;
    var trebRatio = trebAvg / 255.0;
    var specRatio = (bassRatio + midsRatio + trebRatio) / 3.0;
    self.scope.updateVisualizer3d(specRatio, bassRatio, midsRatio, trebRatio);

    drawX = trebCutoff;
    ctx.fillStyle = audioColor;
    for(var idx = 0; idx < 256; ++idx ) {
      drawY = self.audio.analysers.left.timeByteData[idx * 4] / 4.0;
      ctx.fillRect(drawX++, drawY, 2, 2);
    }

    ctx.fillStyle = 'rgb(24,48,96)';
    ctx.fillRect(768,0,3,64);
};

function PulsarSoundcloudPlayerDirective (WebAudio) {
  return {
    'templateUrl': 'views/directives/soundcloud-player.html',
    'restrict': 'E',
    'link': function postLink (scope, element, attrs) {
      scope.message = attrs.starlightMessage;
      scope.visualizer = new PulsarSoundCloudPlayer(WebAudio, scope, element, attrs);
      scope.visualizer.link();
      scope.soundUrl = element.attr('data-sound-url');
    }
  };
}

PulsarSoundcloudPlayerDirective.$inject = [
  'WebAudio'
];

angular.module('pulsarClientApp')
.directive('pulsarSoundcloudPlayer', PulsarSoundcloudPlayerDirective);
