'use strict';

function SidebarCtrl ($scope, PresentationEngine) {

  $scope.className = '';

  $scope.$on('setPresentationMode', function (event, mode) {
    console.log('setPresentationMode', event, mode);
    switch (mode) {
      case 'standard':
        $scope.className = '';
        break;
      case 'dimmed':
        $scope.className = 'dimmed';
        break;
    }
  });

}

SidebarCtrl.$inject = [
  '$scope'
];

angular.module('robcolbertApp')
.controller('SidebarCtrl', SidebarCtrl);
