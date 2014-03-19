// robcolbert-app.js
// AngularJS front-end application for robcolbert.com
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

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
  .when('/pulses', {
    templateUrl: 'views/pulses.html',
    controller: 'PulsesCtrl'
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
