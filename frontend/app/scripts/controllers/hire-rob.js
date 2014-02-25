'use strict';

angular.module('robcolbertApp')
  .controller('HireRobCtrl', function ($scope) {
    $scope.$emit('setPageGroup', 'hireRob');
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
