// controllers/sidebar-pulses.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

var log = require('winston');
log.info('controller: SidebarPulsesController');

var mongoose = require('mongoose');
var SidebarPulses = mongoose.model('SidebarPulses');
var Paginator = require('puretech-foundation').Mongoose.Paginator;

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

module.exports = exports = SidebarPulsesController;
