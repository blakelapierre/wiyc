/*
 * FILE
 *  controllers/pulses/reader.js
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

function PulseReaderCtrl ($scope, $route, $sce, $window, UserSession, Pulses) {

  ga('send', 'pageview');

  $scope.session = UserSession.session;
  $scope.$on('setUserSession', function (event, session) {
    $scope.session = UserSession.session;
  });
  $scope.$on('clearUserSession', function ( ) {
    $scope.session = null;
  });

  $scope.$emit('setPageGroup', 'blog');

  $scope.haveError = false;
  $scope.error = null;

  $scope.pulse = Pulses.get(
    {'pulseId': $route.current.params.pulseId},
    null,
    function onPulsesGetSuccess ( ) {
      console.log('pulse loaded', $scope.pulse);
      ga('send','event', 'Pulses', 'loadSuccess', 1);
      $scope.pulse.excerpt = $sce.trustAsHtml($scope.pulse.excerpt);
      $scope.pulse.content = $sce.trustAsHtml($scope.pulse.content);
      if (angular.isDefined(window.twttr)) {
        setTimeout(window.twttr.widgets.load, 0);
      }
      $window.scrollTo(0, 0);
    },
    function onPulsesGetError (error) {
      console.log('Pulses.get error', error);
      ga('send', 'event', 'Pulses', 'loadError', 1);
      $scope.error = error;
      $scope.haveError = true;
    }
  );

  $scope.calendarMoment = function (date) { return moment(date).calendar(); };
  $scope.fromNow = function (date) { return moment(date).fromNow(); };

  $scope.comment = { }; // empty by default
  $scope.createComment = function ( ) {
    console.log('createComment', $scope.comment);
    Pulses.createComment(
      {'pulseId': $route.current.params.pulseId},
      $scope.comment,
      function onCommentCreateSuccess (newComment) {
        ga('send','event', 'Pulses', 'commentCreateSuccess', 1);
        console.log('comment created', newComment);
        $scope.pulse.interactions.comments.push(newComment);
        $scope.comment = { }; // empty it out
      },
      function onCommentCreateError (error) {
        console.log('createComment error', error);
        ga('send','event', 'Pulses', 'commentCreateError', 1);
        $scope.error = error;
        $scope.haveError = true;
      }
    );
  };
}

PulseReaderCtrl.$inject = [
  '$scope',
  '$route',
  '$sce',
  '$window',
  'UserSession',
  'Pulses'
];

angular.module('robcolbertApp')
.controller('PulseReaderCtrl', PulseReaderCtrl);
