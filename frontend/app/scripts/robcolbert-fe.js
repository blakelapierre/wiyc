/*
 * FILE
 *  robcolbert-app.js
 *
 * PURPOSE
 *  Pulsar application module:
 *  1. Establishes global dependencies
 *  2. Builds the application's routes and handlers.
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

angular.module('robcolbertApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.tinymce',
  'ui.ace'
])
.config(function ($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'views/main.html',
    controller: 'MainCtrl'
  })
  .when('/videos', {
    templateUrl: 'views/videos.html',
    controller: 'VideosCtrl'
  })
  .when('/about', {
    templateUrl: 'views/about.html',
    controller: 'AboutCtrl'
  })
  .when('/signup', {
    templateUrl: 'views/signup.html',
    controller: 'SignupCtrl'
  })
  .when('/verify', {
    templateUrl: 'views/verify.html',
    controller: 'VerifyCtrl'
  })
  .when('/contact', {
    templateUrl: 'views/contact.html',
    controller: 'ContactCtrl'
  })
  .when('/settings', {
    templateUrl: 'views/settings.html',
    controller: 'SettingsCtrl'
  })
  .when('/prototype', {
    templateUrl: 'views/prototype.html',
    controller: 'PrototypeCtrl'
  })
  .when('/prototype/source', {
    templateUrl: 'views/prototype/source.html',
    controller: 'PrototypeSourceCtrl'
  })
  .when('/admin', {
    templateUrl: 'views/admin.html',
    controller: 'AdminCtrl'
  })
  .when('/moving-parts', {
    templateUrl: 'views/moving-parts.html',
    controller: 'MovingPartsCtrl'
  })

  .when('/pulses/studio', {
    templateUrl: 'views/pulses/studio.html',
    controller: 'PulsarStudioCtrl'
  })
  .when('/pulses/composer', {
    templateUrl: 'views/pulses/composer.html',
    controller: 'PulsarComposerCtrl'
  })
  .when('/pulses/:pulseId', {
    templateUrl: 'views/pulses/reader.html',
    controller: 'PulseReaderCtrl'
  })
  .when('/pulses/:pulseId/edit', {
    templateUrl: 'views/pulses/pulseId/edit.html',
    controller: 'PulseEditCtrl'
  })
  .when('/pulses', {
    templateUrl: 'views/pulses.html',
    controller: 'PulsesCtrl'
  })

  .when('/user/:userId?', {
    templateUrl: 'views/user/profile.html',
    controller: 'UserUseridCtrl'
  })

  .when('/posts/compose', {
    redirectTo: '/pulses/composer'
  })
  .when('/posts/:postId', {
    redirectTo: '/pulses/:postId'
  })
  .when('/posts/:postId/edit', {
    redirectTo: '/pulses/:postId/edit'
  })
  .when('/posts', {
    redirectTo: '/pulses'
  })
  .when('/hire-rob', {
    redirectTo: '/about'
  })

  .otherwise({
    redirectTo: '/'
  });
});
