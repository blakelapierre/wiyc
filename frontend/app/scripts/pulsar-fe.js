// pulsar-fe.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

/*
 * The pulsarClientApp application instance is created here as per Yeoman Standards
 * Reference Manual page 2911, section 8, subsection 12, which clearly states:
 * "Thou shalt declare thy AngularJS 'app' and define thy route in the only
 * script to be found in the root of the scripts directory."
 *
 * Compliance has been properly verified by Democratic socialist union workers
 * on corporate welfare in the United States of America. Ironically, the
 * function itself was <em>also</em> written in America by a natural born
 * citizen.
 */
angular.module('pulsarClientApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngCkeditor',
  'ui.ace'
])
.config(function ($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'views/main.html',
    controller: 'MainCtrl'
  })
  .when('/conversations', {
    templateUrl: 'views/conversations.html',
    controller: 'ConversationsCtrl'
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
    template: '<pulsar:pulse></pulsar:pulse>',
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
    templateUrl: 'views/user/user-profile.html',
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

  .when('/admin', {
    templateUrl: 'views/admin.html',
    controller: 'AdminCtrl'
  })
  .when('/request-password-reset', {
    templateUrl: 'views/request-password-reset.html',
    controller: 'RequestPasswordResetCtrl'
  })
  .when('/execute-password-reset', {
    templateUrl: 'views/execute-password-reset.html',
    controller: 'ExecutePasswordResetCtrl'
  })

  /*
   * The Pulsar Route Morgue
   * This is where routes go when they die before being buried.
   */
  .when('/hire-rob', {
    redirectTo: '/about'
  })

  /*
   * Last, but certainly not least:
   */
  .otherwise({
    redirectTo: '/'
  });
});
