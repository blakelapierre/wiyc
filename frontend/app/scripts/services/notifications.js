/*
 * FILE
 *  services/notifications.js
 *
 * PURPOSE
 *  Provides best-effort user notification functionality for Pulsar.
 *  Notifications can appear directly within the Pulsar UI and (if the user
 *  grants permission) on the desktop.
 *
 * LICENSE
 *  Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to
 *  deal in the Software without restriction, including without limitation the
 *  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 *  sell copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 *  IN THE SOFTWARE.
 */

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

angular.module('robcolbertApp')
.service('Notifications', NotificationsService);
