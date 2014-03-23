/*
 * FILE
 *  config/cors.js
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
