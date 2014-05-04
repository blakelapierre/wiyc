// controllers/privacy-policy.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function PrivacyPolicyCtrl ($window) {
  $window.scrollTo(0, 0);
  ga('send', 'pageview');
}

PrivacyPolicyCtrl.$inject = [
  '$window'
];

angular.module('pulsarClientApp')
.controller('PrivacyPolicyCtrl', PrivacyPolicyCtrl);
