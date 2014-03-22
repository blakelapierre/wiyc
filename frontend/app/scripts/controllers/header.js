/*
 * FILE
 *  controllers/header.js
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

function HeaderCtrl ($scope, $rootScope, UserSession, SiteSettings, PulseWire) {

  $scope.site = SiteSettings.get();

  $scope.pulsewire = PulseWire;
  $scope.title = 'robcolbert.com';
  $scope.brand = 'PULSAR';
  $scope.subtitle = 'simplicity as a science';

  $scope.session = UserSession.session;
  $rootScope.$on('setUserSession', function (event, session) {
    $scope.session = session;
    ga('send', 'event', 'Authentication', 'setUserSession', 1);
  });
  $rootScope.$on('clearUserSession', function ( ) {
    $scope.session = null;
    ga('send', 'event', 'Authentication', 'clearUserSession', 1);
  });

  $scope.pills = {
    'main': {
      'className': ''
    },
    'blog': {
      'className': 'active'
    },
    'postComposer': {
      'className': ''
    },
    'videos': {
      'className': ''
    },
    'demos': {
      'className': ''
    },
    'about': {
      'className': ''
    },
    'contact': {
      'className': ''
    },
    'hireRob': {
      'className': ''
    }
  };

  $rootScope.$on('setPageGroup', function onPageGroupChanged (event, group) {
    $.each($scope.pills, function (index, pill) {
      pill.className = '';
    });
    $scope.pills[group].className = 'active';
  });

  $scope.showLoginModal = function ( ) {
    ga('send', 'event', 'Authentication', 'showLoginModal', 1);
    $('#userLoginModal').modal('show');
  };

  $scope.clearUserSession = function ( ) {
    UserSession.logout(function ( ) {
      $scope.$emit('clearUserSession');
    });
  };

}

HeaderCtrl.$inject = [
  '$scope',
  '$rootScope',
  'UserSession',
  'SiteSettings',
  'PulseWire'
];

angular.module('robcolbertApp')
.controller('HeaderCtrl', HeaderCtrl);
