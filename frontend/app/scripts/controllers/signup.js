// controllers/signup.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

function SignupCtrl ($scope, $window, Users, Configuration) {
  $window.scrollTo(0, 0);

  $scope.user = {
    'displayName': 'New User'
  };

  $scope.isComplete = false;
  $scope.haveError = false;
  $scope.errorMessage = null;
  $scope.passwordMatchResult = '';

  var passwordStrengthLabels = [
    'Very Weak',
    'Weak',
    'Better',
    'Medium',
    'Strong',
    'Strongest'
  ];

  $scope.checkPasswords = function ( ) {
    var score   = 0;

    if ($scope.user.password.length > 6) {
      score++;
    }

    //if password has both lower and uppercase characters give 1 point
    if (($scope.user.password.match(/[a-z]/) ) && ($scope.user.password.match(/[A-Z]/))) {
      score++;
    }

    //if password has at least one number give 1 point
    if ($scope.user.password.match(/\d+/)) {
      score++;
    }

    //if password has at least one special caracther give 1 point
    if ($scope.user.password.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)) {
      score++;
    }

    //if password bigger than 12 give another 1 point
    if ($scope.user.password.length > 12) {
      score++;
    }

    $scope.passwordStrengthLabel = passwordStrengthLabels[score];
    $scope.passwordStrength = score / passwordStrengthLabels.length;

    if ($scope.user.password === $scope.passwordVerify) {
      $scope.passwordMatchResult = 'Passwords match.';
    } else {
      $scope.passwordMatchResult = 'Passwords do not match.';
    }
  };

  $scope.createAccount = function ( ) {
    Users.create(
      $scope.user,
      function onCreateSuccess (user) {
        console.log('new user record', user);
        $scope.isComplete = true;
      },
      function onCreateFuckedUp (error) {
        console.log('Users.create is all fucked up & shit', error);
        $scope.haveError = true;
        switch (error.data.name) {
          case 'MongoError':
            switch (error.data.code) {
              case 11000:
                $scope.errorMessage = 'That email address is already registered on this Pulsar.';
                break;
            }
            break;
        }
      }
    );
  };
}

SignupCtrl.$inject = [
  '$scope',
  '$window',
  'Users',
  'Configuration'
];

angular.module('robcolbertApp')
.controller('SignupCtrl', SignupCtrl);
