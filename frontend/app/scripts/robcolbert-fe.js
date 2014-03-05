// robcolbert-app.js
// AngularJS front-end application for robcolbert.com
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

angular.module('robcolbertApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.tinymce'
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

  //
  // LEGACY REDIRECTS AND CATCH-ALL
  //
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
  .otherwise({
    redirectTo: '/'
  });
});
