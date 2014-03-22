/*
 * FILE
 *  controllers/main.js
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

function MainCtrl ($scope, $rootScope, $window, UserSession, Pulses) {
  $window.scrollTo(0, 0);
  $scope.session = UserSession.session;
  console.log('USER', $scope.user);
  $scope.$emit('setPageGroup', 'main');
  ga('send', 'pageview');

  $scope.pulses = Pulses.list();

  $rootScope.$broadcast('showAnnouncement', {
    'title':'Hello Early Adopters',
    'content':'New user signup and public blogging are live! Hit the "Let Me Publish!" button to get started, and welcome to Pulsar!',
    'displayTime': '10000'
  });
}

MainCtrl.$inject = [
  '$scope',
  '$rootScope',
  '$window',
  'UserSession',
  'Pulses'
];

angular.module('robcolbertApp')
.controller('MainCtrl', MainCtrl);
