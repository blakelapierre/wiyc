/*
 * FILE
 *  config/routes.js
 *
 * PURPOSE
 *
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

var RouteAssembler = require('pulsar-api-framework').expressjs.RouteAssembler;

function configureRoutes (app, config) {

  var routes = new RouteAssembler(app, config);

  //
  // USERS
  //
  var users = new (require('../app/controllers/users'))(app, config);

  routes.add({ 'method': 'POST',    'uri': '/users', 'controllerMethod': users.create.bind(users) });
  routes.add({ 'method': 'GET',     'uri': '/users', 'controllerMethod': users.list.bind(users) });

  routes.add({ 'method': 'POST',    'uri': '/users/request-password-reset', 'controllerMethod': users.requestPasswordReset.bind(users) });
  routes.add({ 'method': 'POST',    'uri': '/users/execute-password-reset', 'controllerMethod': users.executePasswordReset.bind(users) });

  routes.add({ 'method': 'GET',     'uri': '/users/me', 'controllerMethod': users.getMyProfile.bind(users) });

  routes.add({ 'method': 'GET',     'uri': '/users/:userId', 'controllerMethod': users.get.bind(users) });
  routes.add({ 'method': 'PUT',     'uri': '/users/:userId', 'controllerMethod': users.update.bind(users) });
  routes.add({ 'method': 'DELETE',  'uri': '/users/:userId', 'controllerMethod': users.delete.bind(users) });

  routes.add({ 'method': 'POST',    'uri': '/users/:userId/verify', 'controllerMethod': users.verifyEmailKey.bind(users) });

  routes.add({ 'method': 'GET',     'uri': '/users/:userId/friends', 'controllerMethod': users.listFriends.bind(users) });
  routes.add({ 'method': 'POST',    'uri': '/users/:userId/friends', 'controllerMethod': users.addFriend.bind(users) });
  routes.add({ 'method': 'DELETE',  'uri': '/users/:userId/friends/:friendId', 'controllerMethod': users.removeFriend.bind(users) });

  //
  // SESSIONS
  //
  var sessions = new (require('../app/controllers/sessions'))(app, config);

  routes.add({ 'method': 'POST',    'uri': '/sessions', 'controllerMethod': sessions.create.bind(sessions) });
  routes.add({ 'method': 'GET',     'uri': '/sessions', 'controllerMethod': sessions.get.bind(sessions) });
  routes.add({ 'method': 'DELETE',  'uri': '/sessions', 'controllerMethod': sessions.delete.bind(sessions) });

  var settings = new (require('../app/controllers/settings'))(app, config);

  routes.add({ 'method': 'GET',     'uri': '/settings', 'controllerMethod': settings.get.bind(settings) });
  routes.add({ 'method': 'PUT',     'uri': '/settings', 'controllerMethod': settings.update.bind(settings) });

  //
  // PULSES
  //
  var pulses = new (require('../app/controllers/pulses'))(app, config);

  routes.add({ 'method': 'GET',     'uri': '/pulses', 'controllerMethod': pulses.list.bind(pulses) });
  routes.add({ 'method': 'POST',    'uri': '/pulses', 'controllerMethod': pulses.create.bind(pulses) });

  routes.add({ 'method': 'GET',     'uri': '/pulses/:pulseId', 'controllerMethod': pulses.get.bind(pulses) });
  routes.add({ 'method': 'PUT',     'uri': '/pulses/:pulseId', 'controllerMethod': pulses.update.bind(pulses) });
  routes.add({ 'method': 'DELETE',  'uri': '/pulses/:pulseId', 'controllerMethod': pulses.delete.bind(pulses) });

  routes.add({ 'method': 'POST',    'uri': '/pulses/:pulseId/comments', 'controllerMethod': pulses.createComment.bind(pulses) });
  routes.add({ 'method': 'GET',     'uri': '/pulses/:pulseId/comments', 'controllerMethod': pulses.getComments.bind(pulses) });

  //
  // SIDEBAR PULSES
  //
  var sidebarPulses = new (require('../app/controllers/sidebar-pulses'))(app, config);

  routes.add({ 'method': 'GET',     'uri': '/sidebar-pulses', 'controllerMethod': sidebarPulses.list.bind(sidebarPulses) });
  routes.add({ 'method': 'POST',    'uri': '/sidebar-pulses', 'controllerMethod': sidebarPulses.create.bind(sidebarPulses) });

  routes.add({ 'method': 'GET',     'uri': '/sidebar-pulses/:pulseId', 'controllerMethod': sidebarPulses.get.bind(sidebarPulses) });
  routes.add({ 'method': 'PUT',     'uri': '/sidebar-pulses/:pulseId', 'controllerMethod': sidebarPulses.update.bind(sidebarPulses) });
  routes.add({ 'method': 'DELETE',  'uri': '/sidebar-pulses/:pulseId', 'controllerMethod': sidebarPulses.delete.bind(sidebarPulses) });

  routes.add({ 'method': 'POST',    'uri': '/sidebar-pulses/:pulseId/comments', 'controllerMethod': sidebarPulses.createComment.bind(sidebarPulses) });
  routes.add({ 'method': 'GET',     'uri': '/sidebar-pulses/:pulseId/comments', 'controllerMethod': sidebarPulses.getComments.bind(sidebarPulses) });

  //
  // VIDEOS
  //
  var videos = new (require('../app/controllers/videos'))(app, config);

  routes.add({ 'method': 'POST',    'uri': '/videos', 'controllerMethod': videos.create.bind(videos) });
  routes.add({ 'method': 'GET',     'uri': '/videos', 'controllerMethod': videos.list.bind(videos) });

  routes.add({ 'method': 'GET',     'uri': '/videos/:videoId', 'controllerMethod': videos.get.bind(videos) });
  routes.add({ 'method': 'PUT',     'uri': '/videos/:videoId', 'controllerMethod': videos.update.bind(videos) });
  routes.add({ 'method': 'DELETE',  'uri': '/videos/:videoId', 'controllerMethod': videos.delete.bind(videos) });

}

module.exports = exports = configureRoutes;
