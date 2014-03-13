// config/routes.js
// Copyright (C) Rob Colbert <rob.isConnected@gmail.com>

'use strict';

var RouteAssembler = require('robcolbert-utils').expressjs.RouteAssembler;

function configureRoutes (app, config) {

  var routes = new RouteAssembler(app, config);

  //
  // USERS
  //
  var users = new (require('../app/controllers/users'))(app, config);

  routes.add({ 'method': 'POST',    'uri': '/users',                  'controllerMethod': function (req, res) { users.create(req,res); }});
  routes.add({ 'method': 'GET',     'uri': '/users',                  'controllerMethod': function (req, res) { users.list(req,res); }});

  routes.add({ 'method': 'GET',     'uri': '/users/me',               'controllerMethod': function (req, res) { users.getMyProfile(req,res); }});

  routes.add({ 'method': 'GET',     'uri': '/users/:userId',          'controllerMethod': function (req, res) { users.get(req,res); }});
  routes.add({ 'method': 'PUT',     'uri': '/users/:userId',          'controllerMethod': function (req, res) { users.update(req,res); }});
  routes.add({ 'method': 'DELETE',  'uri': '/users/:userId',          'controllerMethod': function (req, res) { users.delete(req,res); }});

  routes.add({ 'method': 'POST',    'uri': '/users/:userId/verify',   'controllerMethod': function (req, res) { users.verifyEmailKey(req,res); }});

  routes.add({ 'method': 'GET',     'uri': '/users/:userId/friends',  'controllerMethod': function (req, res) { users.listFriends(req,res); }});
  routes.add({ 'method': 'POST',    'uri': '/users/:userId/friends',  'controllerMethod': function (req, res) { users.addFriend(req,res); }});
  routes.add({ 'method': 'DELETE',  'uri': '/users/:userId/friends/:friendId', 'controllerMethod': function (req, res) { users.removeFriend(req,res); }});

  //
  // SESSIONS
  //
  var sessions = new (require('../app/controllers/sessions'))(app, config);

  routes.add({ 'method': 'POST',    'uri': '/sessions',               'controllerMethod': function (req, res) { sessions.create(req,res); }});
  routes.add({ 'method': 'GET',     'uri': '/sessions',               'controllerMethod': function (req, res) { sessions.get(req,res); }});
  routes.add({ 'method': 'DELETE',  'uri': '/sessions',               'controllerMethod': function (req, res) { sessions.delete(req,res); }});

  var settings = new (require('../app/controllers/settings'))(app, config);

  routes.add({ 'method': 'GET',     'uri': '/settings',               'controllerMethod': function (req, res) { settings.get(req, res); }});
  routes.add({ 'method': 'PUT',     'uri': '/settings',               'controllerMethod': function (req, res) { settings.update(req, res); }});

  //
  // PULSES
  //
  var pulses = new (require('../app/controllers/pulses'))(app, config);

  routes.add({ 'method': 'GET',     'uri': '/pulses',               'controllerMethod': function (req, res) { pulses.list(req, res); }});
  routes.add({ 'method': 'POST',    'uri': '/pulses',               'controllerMethod': function (req, res) { pulses.create(req, res); }});

  routes.add({ 'method': 'GET',     'uri': '/pulses/:id',           'controllerMethod': function (req, res) { pulses.get(req, res); }});
  routes.add({ 'method': 'PUT',     'uri': '/pulses/:id',           'controllerMethod': function (req, res) { pulses.update(req, res); }});
  routes.add({ 'method': 'DELETE',  'uri': '/pulses/:id',           'controllerMethod': function (req, res) { pulses.delete(req, res); }});

  routes.add({ 'method': 'POST',    'uri': '/pulses/:id/comments',  'controllerMethod': function (req, res) { pulses.createComment(req, res); }});
  routes.add({ 'method': 'GET',     'uri': '/pulses/:id/comments',  'controllerMethod': function (req, res) { pulses.getComments(req, res); }});

  //
  // POSTS
  //
  var posts = new (require('../app/controllers/posts'))(app, config);

  routes.add({ 'method': 'GET',     'uri': '/posts',                  'controllerMethod': function (req, res) { posts.list(req, res); }});
  routes.add({ 'method': 'POST',    'uri': '/posts',                  'controllerMethod': function (req, res) { posts.create(req, res); }});

  routes.add({ 'method': 'GET',     'uri': '/posts/:postId',          'controllerMethod': function (req, res) { posts.get(req, res); }});
  routes.add({ 'method': 'PUT',     'uri': '/posts/:postId',          'controllerMethod': function (req, res) { posts.update(req, res); }});
  routes.add({ 'method': 'DELETE',  'uri': '/posts/:postId',          'controllerMethod': function (req, res) { posts.delete(req, res); }});

  routes.add({ 'method': 'POST',    'uri': '/posts/:postId/comments', 'controllerMethod': function (req, res) { posts.createComment(req, res); }});
  routes.add({ 'method': 'GET',     'uri': '/posts/:postId/comments', 'controllerMethod': function (req, res) { posts.getComments(req, res); }});

  //
  // VIDEOS
  //
  var videos = new (require('../app/controllers/videos'))(app, config);

  routes.add({ 'method': 'POST',    'uri': '/videos',                 'controllerMethod': function (req, res) { videos.create(req, res); }});
  routes.add({ 'method': 'GET',     'uri': '/videos',                 'controllerMethod': function (req, res) { videos.list(req, res); }});

  routes.add({ 'method': 'GET',     'uri': '/videos/:videoId',        'controllerMethod': function (req, res) { videos.get(req, res); }});
  routes.add({ 'method': 'PUT',     'uri': '/videos/:videoId',        'controllerMethod': function (req, res) { videos.update(req, res); }});
  routes.add({ 'method': 'DELETE',  'uri': '/videos/:videoId',        'controllerMethod': function (req, res) { videos.delete(req, res); }});

}

module.exports = exports = configureRoutes;
