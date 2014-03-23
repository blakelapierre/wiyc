/*
/* FILE
 *  services/posts.js
 *
 * PURPOSE
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

function PostsService ($resource, Configuration) {
  var serviceUrl = Configuration.buildApiUrl('/posts/:postId');
  var defaultParameters = null;
  return $resource(serviceUrl, defaultParameters, {
    'list': { 'method': 'GET', 'withCredentials':true },
    'get': { 'method': 'GET', 'withCredentials':true },
    'create': { 'method': 'POST', 'withCredentials':true },
    'update': { 'method': 'PUT', 'withCredentials':true },
    'delete': { 'method': 'DELETE', 'withCredentials':true },
    'createComment': {
      'url': Configuration.buildApiUrl('/posts/:postId/comments'),
      'method': 'POST',
      'withCredentials':true
    }
  });
}

PostsService.$inject = [
  '$resource',
  'Configuration'
];

angular.module('robcolbertApp')
.service('Posts', PostsService);
