// services/presentation-engine.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';
/* global $:false */

/*
 * IMPLEMENTATION
 */

function PresentationEngine ($interval) {

  var self = this;

  PresentationEngine.DisplayModes = this.DisplayModes = {
    'STANDARD': 'standard',
    'THEATER': 'theater',
    'PROFILE': 'profile'
  };
  PresentationEngine.TransitionMode = 'transition';

  self.displayMode = PresentationEngine.DisplayModes.STANDARD;
  self.sidebarMode = PresentationEngine.DisplayModes.STANDARD;
  self.nextDisplayMode = null;
  self.leaveCurrentMode = function (cb) { self.leaveStandardMode(cb); };

  self.effects = {
    'quake': {
      'magnitude': 2.0
    }
  };

  self.updateIntervalId = $interval(
    function ( ) { self.update(); },
    1000.0 / 30.0
  );

  // I had to move the jQuery calls to setDisplayMode (for now) because
  // they will not pass tests without some serious authoring, and I do
  // not feel like doing that right now at all.

  self.mainView = null;//TOTAL HACK FOR NOW

}

PresentationEngine.prototype.setQuakeMagnitude = function (magnitude) {
  this.effects.quake.magnitude = magnitude;
};

PresentationEngine.prototype.setDisplayMode = function (mode) {
  var self = this;

  if (self.mainView === null) { //HACK to the finish line when it works
    self.mainView = jQuery('.main-view');
    self.sidebarView = jQuery('.sidebar');
    self.theaterGroup = jQuery('body, .pulse, .page, .footer');
    self.idleHideGroup = jQuery('.idle-hide');
    self.theaterHideGroup = jQuery('.sidebar, .pre-show, #topBar');
  }

  if (self.displayMode === mode ||
     ((self.displayMode === PresentationEngine.TransitionMode) && (self.nextDisplayMode === mode))) {
    return; // bail; already on requested mode or transitioning to it
  }

  /*
   * 1. The user has requested a new mode
   * 2. That mode is not the current mode
   * 3. If transitioning, engine is not transitioning to the requested mode.
   * 4. Store as nextDisplayMode and return.
   *
   * @TODO: implement a cancelTransitions() method
   */
  if (self.displayMode === PresentationEngine.TransitionMode) {
    self.nextDisplayMode = mode;
    return;
  }


  /*
   * The engine is NOT transitioning and NOT in the requested mode.
   * Begin transitioning to the requested mode from the current mode.
   */
  switch (mode) {
    case PresentationEngine.DisplayModes.STANDARD:
      self.leaveCurrentMode(function ( ) {
        // do nothing - all modes are required to return to STANDARD
        self.leaveCurrentMode = function (cb) { self.leaveStandardMode(cb); };
        self.displayMode = PresentationEngine.DisplayModes.STANDARD;
      });
      break;

    case PresentationEngine.DisplayModes.PROFILE:
      self.leaveCurrentMode(function ( ) {
        self.leaveCurrentMode = function (cb) { self.leaveProfileMode(cb); };
        self.displayMode = PresentationEngine.DisplayModes.PROFILE;
      });
      break;

    case PresentationEngine.DisplayModes.THEATER:
      self.theaterHideGroup.fadeOut(1000, function ( ) {
        self.leaveCurrentMode(function ( ) {
          self.leaveCurrentMode = function (cb) { self.leaveTheaterMode(cb); };
          self.enterTheaterMode();
        });
      });
      break;
  }
};

PresentationEngine.prototype.leaveStandardMode = function (callback) {
  var self = this;
  self.sidebarView.fadeOut(1000, function ( ) {
    self.sidebarView
    .removeClass('col-sm-4')
    .removeClass('col-lg-3');

    self.mainView
    .removeClass('col-sm-8')
    .removeClass('col-lg-9')
    .addClass('col-sm-12');

    if (callback) {
      callback();
    }
  });
};

PresentationEngine.prototype.leaveProfileMode = function (callback) {
  if (callback) {
    callback();
  }
};

PresentationEngine.prototype.enterTheaterMode = function (callback) {
  var self = this;

  self.displayMode = PresentationEngine.TransitionMode;

  self.sidebarView
  .removeClass('col-sm-4')
  .removeClass('col-lg-3');

  self.mainView
  .removeClass('col-sm-8')
  .removeClass('col-lg-9')
  .addClass('col-sm-12');

  self.theaterGroup.addClass('theater');
  self.idleHideGroup.fadeIn(1000, function ( ) {
    self.displayMode = PresentationEngine.DisplayModes.THEATER;
    if (callback) {
      callback();
    }
  });
};

PresentationEngine.prototype.leaveTheaterMode = function (callback) {
  var self = this;

  self.displayMode = PresentationEngine.TransitionMode;

  self.idleHideGroup.hide();
  self.theaterGroup.removeClass('theater');

  self.mainView
  .removeClass('col-sm-12')
  .removeClass('col-lg-12')
  .addClass('col-sm-8')
  .addClass('col-lg-9');

  self.sidebarView
  .addClass('col-sm-4')
  .addClass('col-lg-3');

  self.theaterHideGroup.fadeIn(500, callback);
};

PresentationEngine.prototype.update = function ( ) {
  this.updateEffects();
};

PresentationEngine.prototype.updateEffects = function ( ) {
  this.updateQuakeEffect();
};

PresentationEngine.prototype.updateQuakeEffect = function ( ) {
  var self = this;
  var magnitude2x = this.effects.quake.magnitude * 2.0;
  $('.quake').each(function (idx, element) {
    element.style.left = ((Math.random() * magnitude2x) - self.effects.quake.magnitude).toString() + 'px';
    element.style.top = ((Math.random() * magnitude2x) - self.effects.quake.magnitude).toString() + 'px';
  });
};

/*
 * DEPENDENCY INJECTION (AngularJS)
 */
PresentationEngine.$inject = [
  '$interval'
];

/*
 * MODULE DEFINITION (AngularJS)
 */
angular.module('robcolbertApp')
.service('PresentationEngine', PresentationEngine);
