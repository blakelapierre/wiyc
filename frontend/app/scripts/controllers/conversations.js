// controllers/conversations.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function ConversationsCtrl ($scope, $window) {
  $window.scrollTo(0, 0);
  $scope.$emit('setPageGroup', 'conversations');
  ga('send', 'pageview');

  $scope.conversations = [
  /*
    {
      'topic': 'Test conversation',
      'participants': [
        {
          'profileImageUrl':'http://127.0.0.1:9000/images/rob-profile-dark.jpg'
        }
      ],
      'messages': [
        {
          'created':'PLACEHOLDER TS',
          'sender': {
            '_id':'UserIdValue',
            'displayName':'Rob Colbert'
          },
          'content': 'This is a hard-coded placeholder message defined in JSON to build this whole UX against. Will tweak later.'
        }
      ]
    }
  */
  ];
  $scope.conversation = $scope.conversations[0];
  console.log('conversations', $scope.conversations);
}

ConversationsCtrl.$inject = [
  '$scope',
  '$window'
];

angular.module('pulsarClientApp')
.controller('ConversationsCtrl', ConversationsCtrl);
