// controllers/prototype/source.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function PrototypeSourceCtrl ($scope, $http) {

  var _editor = null;
  $scope.prototypeHtml = '';

  $http({'method':'GET', 'url':'source/prototype.html'})
  .success(function onSourceFetchSuccess (html) {
    $scope.prototypeHtml = html;
  })
  .error(function onSourceFetchError (error) {
    console.log('source fetch error', error);
    $scope.error = error;
    $scope.haveError = true;
  });

  function aceLoaded (editor) {
    _editor = editor;
    console.log('aceLoaded', editor);
  };

  function aceChanged (event) {
    console.log('aceChanged', event);
  };

  $scope.aceOptions = {
    'showGutter': true,
    'theme':'chrome',
    'mode':'html',
    'fontSize': 12,
    'readOnly': true,
    'onLoad': aceLoaded,
    'onChange': aceChanged
  };
}

PrototypeSourceCtrl.$inject = [
  '$scope',
  '$http'
];

angular.module('robcolbertApp')
.controller('PrototypeSourceCtrl', PrototypeSourceCtrl);
