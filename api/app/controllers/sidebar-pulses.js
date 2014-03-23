/*
 * FILE
 *  controllers/sidebar-pulses.js
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
log.info('controller: SidebarPulsesController');

var mongoose = require('mongoose');
var SidebarPulses = mongoose.model('SidebarPulses');
var Paginator = require('pulsar-api-framework').expressjs.Paginator;

function SidebarPulsesController (app, config) {
  this.app = app;
  this.config = config;
}

SidebarPulsesController.prototype.create = function (req, res) {
  log.debug('sidebar-pulses.create', req.route, req.query, req.body);
  if (!req.session.user || !req.session.authenticated.status) {
    log.error('SidebarPulses.create called by unauthenticated client', req.session);
    res.json(
      500,
      {
        //@TODO: refactor this to a config file with internationalization
        'message':'Pulse transmission requires user authentication (non-negotiable).'
      }
    );
    return;
  }

  delete req.body._id;
  req.body._creator = req.session.user._id;
  SidebarPulses.create(req.body, function (err, pulse) {
    if (err) {
      log.error('sidebar-pulses.create', err);
      res.json(500, err);
      return;
    }
    pulse.populate(
      {
        'path': '_creator',
        'select': '_id displayName'
      },
      function (err, populatedPulse) {
        if (err) {
          log.error('sidebar-pulses.populate', err);
          res.json(500, err);
          return;
        }
        res.json(200, populatedPulse);
      }
    );
  });
};

SidebarPulsesController.prototype.list = function(req, res){
  log.debug('sidebar-pulses.list', req.route, req.query);

  var query =
  SidebarPulses
  .find({ }, '_creator created content', { 'sort': { 'created': -1 }})
  .lean(true);

  var paginator = new Paginator(req);
  paginator.paginateQuery(query)
  .populate('_creator', '_id displayName')
  .exec(function (err, pulses) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    res.json(200, pulses);
  });
};

SidebarPulsesController.prototype.get = function (req, res) {
  log.debug('sidebar-pulses.get', req.route, req.query);
  SidebarPulses
  .findById(req.route.params.id)
  .lean(true)
  .populate('_creator', '_id displayName')
  .exec(function (err, pulse) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    res.json(200, pulse);
  });
};

SidebarPulsesController.prototype.update = function (req, res) {
  log.debug('sidebar-pulses.update', req.route, req.query, req.body);
  delete req.body._id;
  SidebarPulses.findOneAndUpdate(
    {'_id': req.route.params.id},
    req.body,
    function (err, pulse) {
      if (err) {
        log.error(err);
        res.json(500, err);
        return;
      }
      if (!pulse) {
        res.json(404, {'msg':'pulse not found'});
        return;
      }
      res.json(200, pulse);
    }
  );
};

SidebarPulsesController.prototype.delete = function (req, res) {
  log.debug('sidebar-pulses.delete', req.route, req.query);
  SidebarPulses.findOneAndRemove(
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

SidebarPulsesController.prototype.createComment = function (req, res) {
  log.debug('sidebar-pulses.createComment', req.route, req.query, req.body);
  SidebarPulses
  .findById(req.route.params.id)
  .populate('_creator', '_id displayName')
  .exec(function (err, pulse) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    pulse.comments.push(req.body);
    pulse.save(function (err, commentedPulse) {
      if (err) {
        log.error(err);
        res.json(500, err);
        return;
      }
      res.json(200, commentedPulse);
    });
  });
};

SidebarPulsesController.prototype.getComments = function (req, res) {
  log.debug('sidebar-pulses.getComments', req.route, req.query);
  var paginator = new Paginator(req);
  var query =
  SidebarPulses
  .findById(req.route.params.id, 'comments')
  .lean(true);

  paginator.paginateQuery(query)
  .populate('_creator', '_id displayName')
  .exec(function (err, thought) {
    if (err) {
      log.error(err);
      res.json(500, err);
      return;
    }
    res.json(200, thought.comments);
  });
};

module.exports = exports = SidebarPulsesController;
