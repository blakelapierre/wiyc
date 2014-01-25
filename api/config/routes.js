// config/routes.js
// Copyright (C) Rob Colbert <rob.isConnected@gmail.com>

function RouteAssembler (app) {
  this.app = app;
}

RouteAssembler.prototype.addRoute = function (route) {
  console.log('publishing route:', route.method, route.uri);
  switch (route.method) {
  case 'POST':
    this.app.post(route.uri, route.controller);
    break;
  case 'GET':
    this.app.get(route.uri, route.controller);
    break;
  case 'PUT':
    this.app.put(route.uri, route.controller);
    break;
  case 'DELETE':
    this.app.delete(route.uri, route.controller);
    break;
    
  default:
    console.log('unsupported HTTP method for route: ', route);
    break;
  }
};

module.exports = function Routes (app) {

  var routes = [ ];

  //
  // CONTROLLERS
  //

  var thoughts = require('../app/controllers/thoughts');

  routes.push({ 'method': 'GET',    'uri': '/thoughts',               'controller': thoughts.list });
  routes.push({ 'method': 'POST',   'uri': '/thoughts',               'controller': thoughts.create });
  
  routes.push({ 'method': 'GET',    'uri': '/thoughts/:id',           'controller': thoughts.get });
  routes.push({ 'method': 'PUT',    'uri': '/thoughts/:id',           'controller': thoughts.update });
  routes.push({ 'method': 'DELETE', 'uri': '/thoughts/:id',           'controller': thoughts.delete });
  
  routes.push({ 'method': 'POST',   'uri': '/thoughts/:id/comments',  'controller': thoughts.createComment });
  routes.push({ 'method': 'GET',    'uri': '/thoughts/:id/comments',  'controller': thoughts.getComments });
  
  //
  // ROUTE ASSEMBLER
  //

  var routeIdx, route;
  for (routeIdx in routes) {
    route = routes[routeIdx];
  }
  
};
