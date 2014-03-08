// config/cors.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>

'use strict';

var config = {
  'allowOrigins': [ '*' ],
  'allowMethods': [ 'GET', 'PUT', 'POST', 'DELETE' ],
  'allowHeaders': [ 'Content-Type', 'Authorization' ],
  'allowCredentials': true
};

console.log('CORS Access-Control-Allow-Origin', config.allowOrigins.join());
console.log('CORS Access-Control-Allow-Methods', config.allowMethods.join());
console.log('CORS Access-Control-Allow-Headers', config.allowHeaders.join());
console.log('CORS Access-Control-Allow-Credentials', config.allowCredentials);

module.exports = function(req, res, next) {
  var idx;
  for (idx in config.allowOrigins) {
    res.header('Access-Control-Allow-Origin', config.allowOrigins[idx]);
  }
  res.header('Access-Control-Allow-Methods', config.allowMethods.join());
  res.header('Access-Control-Allow-Headers', config.allowHeaders.join());
  res.header('Access-Control-Allow-Credentials', config.allowCredentials);

  // intercept OPTIONS method
  if ('OPTIONS' === req.method) {
    res.send(200);
    return;
  }
  next();
};
