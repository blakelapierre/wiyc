// config/routes.js
// Copyright (C) Rob Colbert <rob.isConnected@gmail.com>

var RouteAssembler = require('robcolbert-utils').expressjs.RouteAssembler;

module.exports = function Routes (app, config) {

  var routes = new RouteAssembler(app, config);

  //
  // CONTROLLERS
  //

  var thoughts = new (require('../app/controllers/thoughts'))(app, config);

  routes.add({ 'method': 'GET',     'uri': '/thoughts',               'controllerMethod': thoughts.list });
  routes.add({ 'method': 'POST',    'uri': '/thoughts',               'controllerMethod': thoughts.create });

  routes.add({ 'method': 'GET',     'uri': '/thoughts/:id',           'controllerMethod': thoughts.get });
  routes.add({ 'method': 'PUT',     'uri': '/thoughts/:id',           'controllerMethod': thoughts.update });
  routes.add({ 'method': 'DELETE',  'uri': '/thoughts/:id',           'controllerMethod': thoughts.delete });

  routes.add({ 'method': 'POST',    'uri': '/thoughts/:id/comments',  'controllerMethod': thoughts.createComment });
  routes.add({ 'method': 'GET',     'uri': '/thoughts/:id/comments',  'controllerMethod': thoughts.getComments });


  var posts = new (require('../app/controllers/posts'))(app, config);

  routes.add({ 'method': 'GET',     'uri': '/posts',                  'controllerMethod': posts.list });
  routes.add({ 'method': 'POST',    'uri': '/posts',                  'controllerMethod': posts.create });

  routes.add({ 'method': 'GET',     'uri': '/posts/:postId',          'controllerMethod': posts.get });
  routes.add({ 'method': 'PUT',     'uri': '/posts/:postId',          'controllerMethod': posts.update });
  routes.add({ 'method': 'DELETE',  'uri': '/posts/:postId',          'controllerMethod': posts.delete });

  routes.add({ 'method': 'POST',    'uri': '/posts/:postId/comments', 'controllerMethod': posts.createComment });
  routes.add({ 'method': 'GET',     'uri': '/posts/:postId/comments', 'controllerMethod': posts.getComments });


  var videos = new (require('../app/controllers/videos'))(app, config);

  routes.add({ 'method': 'POST',    'uri': '/videos',                 'controllerMethod': videos.create });
  routes.add({ 'method': 'GET',     'uri': '/videos',                 'controllerMethod': videos.list });

  routes.add({ 'method': 'GET',     'uri': '/videos/:videoId',        'controllerMethod': videos.get });
  routes.add({ 'method': 'PUT',     'uri': '/videos/:videoId',        'controllerMethod': videos.update });
  routes.add({ 'method': 'DELETE',  'uri': '/videos/:videoId',        'controllerMethod': videos.delete });

};
