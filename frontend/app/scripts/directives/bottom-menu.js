// directives/bottom-menu.js
// Copyright (C) Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function PulsarBottomMenuCtrl (UserSession) {
  return {
    templateUrl: 'views/directives/bottom-menu.html',
    restrict: 'E',
    link: function postLink(scope, element, attrs) {

      scope.session = UserSession.session;
      console.log('UserSession in bottom-menu', UserSession.session);

      scope.$on('setUserSession', function (event, userSession) {
        console.log('UserSession updated in bottom-menu', userSession);
        scope.session = userSession;
        if (!angular.isDefined(scope.session.authenticated)) {
          scope.session.authenticated = { 'status': false };
        }
      });

      scope.$on('clearUserSession', function (/* event */) {
        console.log('UserSession cleared in bottom-menu');
        self.session = UserSession.defaultSession;
      });

    }
  };
}

PulsarBottomMenuCtrl.$inject = [
  'UserSession'
];

angular.module('pulsarClientApp')
.directive('pulsarBottomMenu', PulsarBottomMenuCtrl);
