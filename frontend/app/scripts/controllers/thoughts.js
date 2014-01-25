'use strict';

angular.module('robcolbertApp')
.controller('ThoughtsCtrl', ['$scope', 'Thoughts', function ($scope, Thoughts) {
  console.log(Thoughts);
  Thoughts.get(function (thoughts) {
    console.log('thoughts', thoughts);
    $scope.thoughts = thoughts;
  });
  $scope.awesomeThings = [
    'HTML5 Boilerplate',
    'AngularJS',
    'Karma'
  ];
}]);
