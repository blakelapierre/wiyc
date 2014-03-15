'use strict';

function PresentationEngine ($rootScope, Configuration) {

  this.sidebarMode = 'standard';
  
}

PresentationEngine.$inject = [
  '$rootScope',
  'Configuration'
];

angular.module('robcolbertApp')
.service('PresentationEngine', PresentationEngine);
