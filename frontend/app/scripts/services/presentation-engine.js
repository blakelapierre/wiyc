/*
 * FILE
 *  services/presentation-engine.js
 *
 * PURPOSE
 *
 *
 * LICENSE
 *  Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to
 *  deal in the Software without restriction, including without limitation the
 *  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 *  sell copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 *  IN THE SOFTWARE.
 */

'use strict';
/* global $:false */

/*
 * IMPLEMENTATION
 */

function transitionStub (callback) { callback(); }

function PresentationEngine ( ) {

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
  self.leaveCurrentMode = transitionStub;

}

PresentationEngine.prototype.setDisplayMode = function (mode) {
  var self = this;

  var mainView = $('.main-view');
  var sidebarView = $('.sidebar');

  var idleHideGroup = $('.idle-hide');

  var theaterGroup = $('body, .pulsar-media-sc, .footer');
  var theaterHideGroup = $('.sidebar, .pre-show, #topBar');

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

  function leaveStandardMode (callback) {
    callback();
  }

  function leaveProfileMode (callback) {
    callback();
  }

  function leaveTheaterMode (callback) {
    self.displayMode = PresentationEngine.TransitionMode;
    idleHideGroup.hide();
    theaterGroup.removeClass('theater');
    mainView.removeClass('col-sm-12').addClass('col-sm-8');
    sidebarView.addClass('col-sm-4');
    theaterHideGroup.fadeIn(500, callback);
  }

  /*
   * The engine is NOT transitioning and NOT in the requested mode.
   * Begin transitioning to the requested mode from the current mode.
   */
  switch (mode) {
    case PresentationEngine.DisplayModes.STANDARD:
      self.leaveCurrentMode(function ( ) {
        // do nothing - all modes are required to return to STANDARD
        self.leaveCurrentMode = leaveStandardMode;
        self.displayMode = PresentationEngine.DisplayModes.STANDARD;
      });
      break;

    case PresentationEngine.DisplayModes.PROFILE:
      self.leaveCurrentMode(function ( ) {
        self.leaveCurrentMode = leaveProfileMode;
        self.displayMode = PresentationEngine.DisplayModes.PROFILE;
      });
      break;

    case PresentationEngine.DisplayModes.THEATER:
      self.leaveCurrentMode(function ( ) {
        self.leaveCurrentMode = leaveTheaterMode;
        $('.pre-show, .sidebar, #topBar').fadeOut(1000, function ( ) {
          $('.sidebar').removeClass('col-sm-4');
          $('.main-view').removeClass('col-sm-8').addClass('col-sm-12');
          theaterGroup.addClass('theater');
          $('.idle-hide').fadeIn(1000, function ( ) {
            self.displayMode = PresentationEngine.DisplayModes.THEATER;
          });
        });
      });
      break;

  }
};

/*
 * DEPENDENCY INJECTION (AngularJS)
 */
PresentationEngine.$inject = [ ];

/*
 * MODULE DEFINITION (AngularJS)
 */
angular.module('robcolbertApp')
.service('PresentationEngine', PresentationEngine);
