// services/presentation-engine.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';
/* global $:false */

//
// IMPLEMENTATION
//

function PresentationEngine ( ) {

  var self = this;

  // One way or another, I'm getting these damn constants on this object and
  // everything it knows how to be so I can use them universally everywhere
  // with a syntax that resembles what I call "normal".
  PresentationEngine.DisplayModes = this.DisplayModes = {
    'STANDARD': 'standard',
    'THEATER': 'theater',
    'TRANSITION': 'transition'
  };

  self.displayMode = PresentationEngine.DisplayModes.STANDARD;
  self.sidebarMode = PresentationEngine.DisplayModes.STANDARD;

}

PresentationEngine.prototype.setDisplayMode = function (mode) {
  var self = this;

  // if the engine is transitioning or at the requested mode, abort.
  if (self.displayMode === PresentationEngine.DisplayModes.TRANSITION ||
      self.displayMode === mode) {
    return;
  }

  switch (mode) {
    case PresentationEngine.DisplayModes.THEATER:
      self.displayMode = PresentationEngine.DisplayModes.TRANSITION;
      $('.pre-show, .sidebar, #topBar').fadeOut(1000, function ( ) {
        $('.sidebar').removeClass('col-sm-4');
        $('.main-view').removeClass('col-sm-8').addClass('col-sm-12');
        $('body, .pulsar-media-sc, .footer').addClass('theater');
        $('.idle-hide').fadeIn(1000, function ( ) {
          self.displayMode = PresentationEngine.DisplayModes.THEATER;
        });
      });
      break;

    case PresentationEngine.DisplayModes.STANDARD:
      if (self.displayMode !== PresentationEngine.DisplayModes.THEATER) {
        return;
      }
      self.displayMode = PresentationEngine.DisplayModes.TRANSITION;
      $('.idle-hide').hide();
      $('body, .pulsar-media-sc, .footer').removeClass('theater');
      $('.main-view').removeClass('col-sm-12').addClass('col-sm-8');
      $('.sidebar').addClass('col-sm-4');
      $('.sidebar, .pre-show, #topBar').fadeIn(500, function ( ) {
        self.displayMode = 'standard';
      });
      break;
  }
};

//
// DEPENDENCY INJECTION (AngularJS)
//

PresentationEngine.$inject = [ ];

//
// MODULE DEFINITION (AngularJS)
//

angular.module('robcolbertApp')
.service('PresentationEngine', PresentationEngine);
