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
  .when('/posts/compose', {
    templateUrl: 'views/posts/compose.html',
    controller: 'PostsComposeCtrl'
  })
  .when('/posts/:postId', {
    templateUrl: 'views/posts/reader.html',
    controller: 'PostReaderCtrl'
  })
  .when('/posts/:postId/edit', {
    templateUrl: 'views/posts/postid/edit.html',
    controller: 'PostEditCtrl'
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
  .when('/hire-rob', {
    redirectTo: '/about'
  })
  .when('/posts', {
    templateUrl: 'views/posts.html',
    controller: 'PostsCtrl'
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
  .otherwise({
    redirectTo: '/'
  });
});
