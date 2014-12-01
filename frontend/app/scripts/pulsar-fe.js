// pulsar-fe.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

/*
 * The wiyc application instance is created here as per Yeoman Standards
 * Reference Manual page 2911, section 8, subsection 12, which clearly states:
 * "Thou shalt declare thy AngularJS 'app' and define thy route in the only
 * script to be found in the root of the scripts directory."
 *
 * Compliance has been properly verified by Democratic socialist union workers
 * on corporate welfare in the United States of America. Ironically, the
 * function itself was <em>also</em> written in America by a natural born
 * citizen.
 */
angular.module('wiyc', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.ace'
])
.config(function ($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'views/congresspeople.html',
    controller: 'CongresspeopleCtrl'
  })

  .when('/about', {
    templateUrl: 'views/about.html',
    controller: 'AboutCtrl'
  })

  .when('/senator/:name', {
    templateUrl: 'views/congressperson.html',
    controller: 'CongresspersonCtrl'
  })
  .when('/representative/:name', {
    templateUrl: 'views/congressperson.html',
    controller: 'CongresspersonCtrl'
  })

  .otherwise({
    redirectTo: '/'
  });
});
