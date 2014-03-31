// controllers/admin.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

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
