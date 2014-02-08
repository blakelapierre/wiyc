// config/routes.js
// Copyright (C) Rob Colbert <rob.isConnected@gmail.com>

var RouteAssembler = require('robcolbert-utils').expressjs.RouteAssembler;

module.exports = function Routes (app) {

  var routes = new RouteAssembler(app);

  //
  // CONTROLLERS
  //

  var thoughts = require('../app/controllers/thoughts');

  routes.add({ 'method': 'GET',     'uri': '/thoughts',               'controllerMethod': thoughts.list });
  routes.add({ 'method': 'POST',    'uri': '/thoughts',               'controllerMethod': thoughts.create });

  routes.add({ 'method': 'GET',     'uri': '/thoughts/:id',           'controllerMethod': thoughts.get });
  routes.add({ 'method': 'PUT',     'uri': '/thoughts/:id',           'controllerMethod': thoughts.update });
  routes.add({ 'method': 'DELETE',  'uri': '/thoughts/:id',           'controllerMethod': thoughts.delete });

  routes.add({ 'method': 'POST',    'uri': '/thoughts/:id/comments',  'controllerMethod': thoughts.createComment });
  routes.add({ 'method': 'GET',     'uri': '/thoughts/:id/comments',  'controllerMethod': thoughts.getComments });

  var posts = require('../app/controllers/posts');

  routes.add({ 'method': 'GET',     'uri': '/posts',                  'controllerMethod': posts.list });
  routes.add({ 'method': 'POST',    'uri': '/posts',                  'controllerMethod': posts.create });

  routes.add({ 'method': 'GET',     'uri': '/posts/:postId',          'controllerMethod': posts.get });
  routes.add({ 'method': 'PUT',     'uri': '/posts/:postId',          'controllerMethod': posts.update });
  routes.add({ 'method': 'DELETE',  'uri': '/posts/:postId',          'controllerMethod': posts.delete });

  routes.add({ 'method': 'POST',    'uri': '/posts/:postId/comments', 'controllerMethod': posts.createComment });
  routes.add({ 'method': 'GET',     'uri': '/posts/:postId/comments', 'controllerMethod': posts.getComments });

};
