/*
 * FILE
 *  controllers/admin.js
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

function AdminCtrl ($scope, $window, $location, UserSession, SiteSettings, Configuration) {

  $scope.tinymceOptions = Configuration.tinymceOptions;
  $scope.tinymceOptions.height = 240;
  $scope.tinymceOptionsplugins = [
    'advlist autolink lists link charmap preview hr anchor',
    'pagebreak searchreplace wordcount visualblocks visualchars code',
    'fullscreen insertdatetime media nonbreaking table contextmenu',
    'directionality emoticons template paste textcolor'
  ];

  $scope.session = UserSession.session;
  if (!$scope.session.authenticated.status || !$scope.session.user.isAdmin) {
    $location.path('/');  // send them home; and
    return;               // refuse to provide an editable interface for the post data.
  }

  $scope.options = SiteSettings.get();
  $scope.save = function ( ) {
    $scope.options.$update(
      function onSaveSuccess (options) {
        console.log('options saved', options);
      },
      function onSaveError (error) {
        console.log('error saving options', error);
      }
    );
  };

}

AdminCtrl.$inject = [
  '$scope',
  '$window',
  '$location',
  'UserSession',
  'SiteSettings',
  'Configuration'
];

angular.module('robcolbertApp')
.controller('AdminCtrl', AdminCtrl);
