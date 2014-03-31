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
  var self = this;

  if (!this.app.checkAuthentication(req,res,'Only authenticated users can create sidebar pulses')) {
    return;
  }
  log.info('sidebar-pulses.create', req.session.user);

  delete req.body._id;
  req.body._creator = req.session.user._id;

  SidebarPulses.create(req.body, function (err, pulse) {
    if (self.app.checkError(err, res, 'sidebar-pulses.create')) {
      return;
    }
    pulse.populate(
      {
        'path': '_creator',
        'select': '_id displayName'
      },
      function (err, populatedPulse) {
        if (self.app.checkError(err, res, 'sidebar-pulses.create')) {
          return;
        }
        res.json(200, populatedPulse);
      }
    );
  });
};

SidebarPulsesController.prototype.list = function(req, res){
  var self = this;

  log.info('sidebar-pulses.list');

  var query =
  SidebarPulses
  .find({ }, '_creator created content', { 'sort': { 'created': -1 }})
  .lean(true);

  var paginator = new Paginator(req);
  paginator.paginateQuery(query)
  .populate('_creator', '_id displayName')
  .exec(function (err, pulses) {
    if (self.app.checkError(err, res, 'sidebar-pulses.list')) {
      return;
    }
    res.json(200, pulses);
  });
};

SidebarPulsesController.prototype.get = function (req, res) {
  var self = this;

  log.info('sidebar-pulses.get', 'pulseId', {'pulseId':req.route.params.pulseId});

  SidebarPulses
  .findById(req.route.params.pulseId)
  .lean(true)
  .populate('_creator', '_id displayName')
  .exec(function (err, pulse) {
    if (self.app.checkError(err, res, 'sidebar-pulses.get')) {
      return;
    }
    res.json(200, pulse);
  });
};

SidebarPulsesController.prototype.update = function (req, res) {
  var self = this;

  if (!self.app.checkAuthentication(req,res,'Only authenticated users can update sidebar pulses')) {
    return;
  }
  log.info('sidebar-pulses.update', req.session.user, req.route.params.pulseId);

  delete req.body._id;

  SidebarPulses
  .findById(req.route.params.pulseId)
  .exec(function (err, pulse) {
    if (self.app.checkError(err, res, 'sidebar-pulses.update')) {
      return;
    }
    if (!pulse) {
      res.json(404, {'message':'Pulse not found'});
      return;
    }
    if (pulse._creator.toString() !== req.session.user._id.toString()) {
      res.json(403, {'message':'Pulse update forbidden'});
      return;
    }

    pulse.content = req.body.content;
    pulse.save(function (err, newPulse) {
      if (self.app.checkError(err, res, 'sidebar-pulses.update')) {
        return;
      }
      newPulse.populate('_creator', function (err, populatedPulse) {
        if (self.app.checkError(err, res, 'sidebar-pulses.update')) {
          return;
        }
        res.json(200, populatedPulse);
      });
    });
  });
};

SidebarPulsesController.prototype.delete = function (req, res) {
  var self = this;

  if (!self.app.checkAuthentication(req, res, 'Only authenticated users can delete a sidebar pulse')) {
    return;
  }
  log.info('sidebar-pulses.delete', req.session.user, req.route.params.pulseId);

  SidebarPulses
  .findById(req.route.params.pulseId)
  .lean(true)
  .exec(function (err, pulse) {
    if (self.app.checkError(err, res, 'sidebar-pulses.delete')) {
      return;
    }
    if (pulse._creator.toString() !== req.session.user._id.toString()) {
      res.json(403, {
        'guard':'Pulse Ownership',
        'message':'Only the creator of this pulse or an administrator can delete a pulse'
      });
      return;
    }
    pulse.remove(function (err) {
      if (self.app.checkError(err, res, 'sidebar-pulses.delete')) {
        return;
      }
      res.json(200, {'message':'Sidebar pulse successfully removed'});
    });
  });
};

SidebarPulsesController.prototype.createComment = function (req, res) {
  var self = this;

  if (!self.app.checkAuthentication(req,res,'Only authenticated users can create comments')) {
    return;
  }
  log.info('sidebar-pulses.createComment', req.session.user, req.route.params.pulseId);

  SidebarPulses
  .findById(req.route.params.pulseId)
  .populate('_creator', '_id displayName')
  .exec(function (err, pulse) {
    if (self.app.checkError(err, res, 'sidebar-pulses.createComment')) {
      return;
    }
    pulse.interactions.comments.push(req.body);
    pulse.save(function (err, commentedPulse) {
      if (self.app.checkError(err, res, 'sidebar-pulses.createComment')) {
        return;
      }
      commentedPulse.populate('_creator', function (err, populatedPulse) {
        if (self.app.checkError(err, res, 'sidebar-pulses.createComment')) {
          return;
        }
        res.json(200, populatedPulse);
      });
    });
  });
};

SidebarPulsesController.prototype.getComments = function (req, res) {
  var self = this;

  log.info('sidebar-pulses.getComments', req.route.params.pulseId);

  var query =
  SidebarPulses
  .findById(req.route.params.pulseId, 'comments')
  .lean(true);

  var paginator = new Paginator(req);
  paginator.paginateQuery(query)
  .populate('_creator', '_id displayName')
  .exec(function (err, pulse) {
    if (self.app.checkError(err, res, 'sidebar-pulses.getComments')) {
      return;
    }
    res.json(200, pulse.comments);
  });
};

module.exports = exports = SidebarPulsesController;
