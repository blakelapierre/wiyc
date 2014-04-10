// services/notifications.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function NotificationsService ( ) {

  var self = this;

  self.havePermission = (Notification.permission === 'granted');
  if (!self.havePermission) {
    self.requestPermission(function (permission) {
      if (permission !== 'granted') {
        self.havePermission = false;
        return;
      }
      self.havePermission = true;
      self.notification = new Notification('Hello from Pulsar!', {
        'tag':'pulsar_System',
        'body':'This is a text notification from Pulsar. Shit is about to get real!'
      });
    });
  }

}

NotificationsService.prototype.requestPermission = function (callback) {
  var self = this;
  Notification.requestPermission(function onPermissionResult (permission) {
    console.log('Web Notification API permission', permission);
    callback(permission);
    self.havePermission = (permission === 'granted');
    if (self.havePermission) {
      self.showWelcomeMessage();
    }
  });
};

NotificationsService.prototype.showWelcomeMessage = function ( ) {
  var self = this;
  var notification = self.showNotification('Pulsar System Message', {
    'tag':'pulsar_System',
    'body':'Pulsar desktop notifications enabled. You can minimize Pulsar and still see what\'s going on.'
  });
  var notificationTimeoutId = setTimeout(
    function onNotificationTimeout ( ) {
      notification.close();
      notificationTimeoutId = null;
    },
    5000
  );

  function cancelNotificationTimeout ( ) {
    if (notificationTimeoutId === null) {
      return;
    }
    clearTimeout(notificationTimeoutId);
    notificationTimeoutId = null;
  }

  function onNotificationClick ( ) {
    console.log('notification clicked');
    cancelNotificationTimeout();
    notification.close();
  }
  function onNotificationError (error) {
    console.log('notification error', error);
  }
  function onNotificationClose ( ) {
    console.log('notification closed');
    cancelNotificationTimeout();
    notification.removeEventListener('close', onNotificationClose);
  }

  notification.addEventListener('close', onNotificationClose);
  notification.addEventListener('error', onNotificationError);
  notification.addEventListener('click', onNotificationClick);
};

NotificationsService.prototype.showNotification = function (title, options) {
  var notifyOptions = { 'tag': 'pulsar_system', 'icon': 'favicon.ico', 'lang': 'en-US' };
  for (var name in options) {
    notifyOptions[name] = options[name];
  }
  var notification = new Notification(title, options);
  return notification;
};

NotificationsService.$inject = [ ];

angular.module('pulsarClientApp')
.service('Notifications', NotificationsService);
