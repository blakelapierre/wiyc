/*
 * FILE
 *  controllers/videos.js
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

var log = require('winston');
log.info('controller: VideosController');

var mongoose = require('mongoose');
var Videos = mongoose.model('Videos');
var Paginator = require('pulsar-api-framework').expressjs.Paginator;

function VideosController (app, config) {
  this.app = app;
  this.config = config;
}

VideosController.prototype.list = function(req, res){
  log.debug('videos.list', req.route, req.query);
  var paginator = new Paginator(req);
  var query = Videos.find({ }, null, { 'sort': { 'created': -1 }});
  paginator.paginateQuery(query).exec(function (err, videos) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    res.json(200, videos);
  });
};

VideosController.prototype.create = function (req, res) {
  log.debug('videos.create', req.route, req.query, req.body);
  var thought = new Videos(req.body);
  thought.save(function (err, newVideo) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    res.json(200, newVideo);
  });
};

VideosController.prototype.get = function (req, res) {
  log.debug('videos.get', req.route, req.query);
  Videos.findById(req.route.params.id, function (err, video) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    res.json(200, video);
  });
};

VideosController.prototype.update = function (req, res) {
  log.debug('videos.update', req.route, req.query, req.body);
  delete req.body._id;
  Videos.findOneAndUpdate(
    {'_id': req.route.params.id},
    req.body,
    function (err, thought) {
      if (err) {
        log.error(err);
        res.json(500, err);
        return;
      }
      if (!thought) {
        log.error('video not found', err);
        res.json(404, {'msg':'thought not found (and that\'s funny shit)'});
        return;
      }
      res.json(200, thought);
    }
  );
};

VideosController.prototype.delete = function (req, res) {
  log.debug('videos.delete', req.route, req.query);
  Videos.findOneAndRemove(
    {'_id': req.route.params.id },
    function (err) {
      if (err) {
        log.error(err);
        res.json(500, err);
        return;
      }
      res.json(200);
    }
  );
};

VideosController.prototype.createComment = function (req, res) {
  log.debug('videos.createComment', req.route, req.query, req.body);
  Videos.findById(req.route.params.id, function (err, video) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    video.comments.push(req.body);
    video.save(function (err, newVideo) {
      res.json(200, newVideo);
    });
  });
};

VideosController.prototype.getComments = function (req, res) {
  log.debug('videos.getComments', req.route, req.query);
  var paginator = new Paginator(req);
  var query = Videos.findById(req.route.params.id, 'comments').lean(true);
  paginator.paginateQuery(query).exec(function (err, video) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    res.json(200, video.comments);
  });
};

module.exports = exports = VideosController;
